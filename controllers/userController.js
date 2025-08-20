const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Address = require('../models/Address');
const Cart = require('../models/Cart');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// USER AUTH & PROFILE
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({ name, email, password: hashedPassword });
  await user.save();

  const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password')
    .populate('addresses');
  res.json(user);
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Old password is incorrect' });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
  res.json({ msg: 'Password updated' });
};

// ADDRESS HANDLERS
const addUserAddress = async (req, res) => {
  console.log('Received Address Data:', req.body);
  const address = new Address({ ...req.body, user: req.user.id });
  await address.save();
  const user = await User.findById(req.user.id);
  user.addresses.push(address._id);
  await user.save();
  res.json(address);
};

const updateUserAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    console.log('Updating Address ID:', addressId, 'with Data:', req.body);
    const address = await Address.findById(addressId);
    if (!address || address.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Address not found or not yours' });
    }
    const updatedAddress = await Address.findByIdAndUpdate(addressId, req.body, { new: true });
    res.json(updatedAddress);
  } catch (err) {
    console.error('Update Address Error:', err.message);
    res.status(500).json({ msg: 'Server error updating address', error: err.message });
  }
};

const deleteUserAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const address = await Address.findById(addressId);
    if (!address || address.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Address not found or not yours' });
    }
    await Address.findByIdAndDelete(addressId);
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter((id) => id.toString() !== addressId);
    await user.save();
    res.json({ msg: 'Address deleted' });
  } catch (err) {
    console.error('Delete Address Error:', err.message);
    res.status(500).json({ msg: 'Server error deleting address', error: err.message });
  }
};

// CATEGORY & PRODUCT HANDLERS
const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

const getProductsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.category;
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ msg: `Category '${categoryName}' not found. Add it in the admin panel first!` });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ category: category._id })
      .populate('category', 'name')
      .skip(skip)
      .limit(limit);
    const totalProducts = await Product.countDocuments({ category: category._id });

    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error('Get Products Error:', err.message);
    res.status(500).json({ msg: 'Server error fetching products', error: err.message });
  }
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name');
  if (!product) return res.status(404).json({ msg: 'Product not found' });

  const reviews = await Review.find({ product: req.params.id })
    .populate('user', 'name');
  res.json({ product, reviews });
};

const searchProducts = async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find({ name: { $regex: q, $options: 'i' } })
    .populate('category', 'name')
    .skip(skip)
    .limit(limit);
  const totalProducts = await Product.countDocuments({ name: { $regex: q, $options: 'i' } });

  res.json({
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
  });
};

const getRecommendations = async (req, res) => {
  const products = await Product.find()
    .populate('category', 'name')
    .limit(5);
  res.json(products);
};

// CART HANDLERS
const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id })
    .populate('items.product');
  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
    await cart.save();
  }
  res.json(cart);
};

const updateCart = async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ msg: 'Product not found' });
  if (quantity > product.stock) {
    return res.status(400).json({ msg: `Only ${product.stock} ${product.name} available in stock` });
  }

  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
  if (itemIndex > -1) {
    if (quantity <= 0) cart.items.splice(itemIndex, 1);
    else cart.items[itemIndex].quantity = quantity;
  } else if (quantity > 0) {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  await cart.populate('items.product');
  res.json(cart);
};

// COUPON HANDLER
const applyCoupon = async (req, res) => {
  const { couponCode } = req.body;
  const coupon = await Coupon.findOne({ code: couponCode, expiryDate: { $gte: new Date() } });
  if (!coupon) return res.status(400).json({ msg: 'Invalid or expired coupon' });
  res.json({ discount: coupon.discount });
};

// ORDER HANDLERS
const placeOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' });
    }

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ msg: 'Invalid address ID format' });
    }
    const address = await Address.findById(addressId);
    if (!address || address.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: 'Address not found or not yours' });
    }

    // Check stock availability before proceeding
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          msg: `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`,
        });
      }
    }

    let total = cart.items.reduce(
      (sum, item) => sum + item.product.discountedPrice * item.quantity,
      0
    );
    let discountApplied = 0;

    let method = paymentMethod;
    if (paymentMethod === 'Card') {
      method = 'Credit Card';
    }

    const order = new Order({
      user: req.user.id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        priceAtOrder: item.product.discountedPrice,
      })),
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        country: address.country,
      },
      total,
      paymentMethod: method,
      discountApplied,
    });

    await order.save(); // Stock will be deducted here due to pre-save middleware
    cart.items = [];
    await cart.save();

    await order.populate({ path: 'items.product' });
    res.json(order);
  } catch (err) {
    console.error('Place Order Error:', err.message);
    res.status(500).json({ msg: 'Server error placing order', error: err.message });
  }
};

const getOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user.id })
    .populate('items.product')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalOrders = await Order.countDocuments({ user: req.user.id });
  res.json({
    orders,
    totalPages: Math.ceil(totalOrders / limit),
    currentPage: page,
  });
};

const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order || order.user.toString() !== req.user.id)
    return res.status(404).json({ msg: 'Order not found' });
  if (order.status !== 'Pending')
    return res.status(400).json({ msg: 'Cannot cancel order' });

  order.status = 'Cancelled';
  await order.save(); // Stock will be restored here due to post-save middleware
  await order.populate('items.product');
  res.json(order);
};

// REVIEW HANDLER
const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const review = new Review({
    user: req.user.id,
    product: productId,
    rating,
    comment,
  });
  await review.save();

  const product = await Product.findById(productId);
  const reviews = await Review.find({ product: productId });
  product.avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  product.numReviews = reviews.length;
  await product.save();

  await review.populate('user', 'name');
  res.json(review);
};

// WISHLIST HANDLERS
const getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user.id, products: [] });
    await wishlist.save();
  }
  res.json(wishlist);
};

const updateWishlist = async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user.id, products: [] });
  }

  const index = wishlist.products.indexOf(productId);
  if (index > -1) wishlist.products.splice(index, 1);
  else wishlist.products.push(productId);
  await wishlist.save();
  await wishlist.populate('products');
  res.json(wishlist);
};

const removeFromWishlist = async (req, res) => {
  const { productId } = req.body;
  const wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) return res.status(404).json({ msg: 'Wishlist not found' });

  wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
  await wishlist.save();
  await wishlist.populate('products');
  res.json(wishlist);
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserPassword,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getCategories,
  getProductsByCategory,
  getProductById,
  searchProducts,
  getRecommendations,
  getCart,
  updateCart,
  applyCoupon,
  placeOrder,
  getOrders,
  cancelOrder,
  addReview,
  getWishlist,
  updateWishlist,
  removeFromWishlist,
};