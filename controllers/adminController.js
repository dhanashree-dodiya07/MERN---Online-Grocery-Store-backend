const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');
const Address = require('../models/Address');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');

// USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching users' });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error updating user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error deleting user' });
  }
};

// CATEGORIES
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching categories' });
  }
};

const addCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ msg: 'Server error adding category' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ msg: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ msg: 'Server error updating category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ msg: 'Category not found' });
    res.json({ msg: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error deleting category' });
  }
};

// PRODUCTS
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching products' });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error adding product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error updating product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error deleting product' });
  }
};

// ORDERS
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name')
      .populate('items.product', 'name');
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching orders' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    Object.assign(order, req.body);
    const updatedOrder = await order.save(); // Triggers stock deduction hook
    res.json(updatedOrder);
  } catch (err) {
    console.error('Update Order Error:', err.message);
    res.status(500).json({ msg: 'Server error updating order' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json({ msg: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error deleting order' });
  }
};

// COUPONS
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching coupons' });
  }
};

const addCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ msg: 'Server error adding coupon' });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ msg: 'Coupon not found' });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ msg: 'Server error updating coupon' });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ msg: 'Coupon not found' });
    res.json({ msg: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error deleting coupon' });
  }
};

// REVIEWS
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('product', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching reviews' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ msg: 'Review not found' });
    res.json({ msg: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error deleting review' });
  }
};

// ADDRESSES
const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find().populate('user', 'name');
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching addresses' });
  }
};

const updateAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!address) return res.status(404).json({ msg: 'Address not found' });
    res.json(address);
  } catch (err) {
    res.status(500).json({ msg: 'Server error updating address' });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) return res.status(404).json({ msg: 'Address not found' });
    res.json({ msg: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error deleting address' });
  }
};

// CARTS
const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate('user', 'name')
      .populate('items.product', 'name');
    res.json(carts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching carts' });
  }
};

const updateCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ msg: 'Server error updating cart' });
  }
};

const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    res.json({ msg: 'Cart deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error deleting cart' });
  }
};

// WISHLISTS
const getAllWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find()
      .populate('user', 'name')
      .populate('products', 'name');
    res.json(wishlists);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching wishlists' });
  }
};

const updateWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!wishlist) return res.status(404).json({ msg: 'Wishlist not found' });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ msg: 'Server error updating wishlist' });
  }
};

const deleteWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findByIdAndDelete(req.params.id);
    if (!wishlist) return res.status(404).json({ msg: 'Wishlist not found' });
    res.json({ msg: 'Wishlist deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error deleting wishlist' });
  }
};

module.exports = {
  getAllUsers, updateUser, deleteUser,
  getCategories, addCategory, updateCategory, deleteCategory,
  getAllProducts, addProduct, updateProduct, deleteProduct,
  getAllOrders, updateOrder, deleteOrder,
  getAllCoupons, addCoupon, updateCoupon, deleteCoupon,
  getAllReviews, deleteReview,
  getAllAddresses, updateAddress, deleteAddress,
  getAllCarts, updateCart, deleteCart,
  getAllWishlists, updateWishlist, deleteWishlist,
};