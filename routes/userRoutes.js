const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserPassword,
  addUserAddress,
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
  updateUserAddress,
  deleteUserAddress,
} = require('../controllers/userController');
const auth = require('../middleware/auth');

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', auth, getUserProfile);
router.put('/password', auth, updateUserPassword);
router.post('/address', auth, addUserAddress);
router.put('/address/:id', auth, updateUserAddress);
router.delete('/address/:id', auth, deleteUserAddress);

// Product Routes
router.get('/categories', getCategories);
router.get('/products/category/:category', getProductsByCategory);
router.get('/products/:id', getProductById);
router.get('/search', searchProducts);
router.get('/recommendations', getRecommendations);

// Cart Routes
router.get('/cart', auth, getCart);
router.post('/cart', auth, updateCart);

// Coupon Routes
router.post('/coupon', auth, applyCoupon);

// Order Routes
router.post('/order', auth, placeOrder);
router.get('/orders', auth, getOrders);
router.put('/orders/:id/cancel', auth, cancelOrder);

// Review Routes
router.post('/review', auth, addReview);

// Wishlist Routes
router.get('/wishlist', auth, getWishlist);
router.post('/wishlist', auth, updateWishlist);
router.delete('/wishlist', auth, removeFromWishlist);

module.exports = router;