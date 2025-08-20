const express = require('express');
const router = express.Router();
const {
  // Users
  getAllUsers, updateUser, deleteUser,
  // Categories
  addCategory, updateCategory, deleteCategory, getCategories,
  // Products (added GET endpoint)
  addProduct, updateProduct, deleteProduct, getAllProducts,
  // Orders
  getAllOrders, updateOrder, deleteOrder,
  // Coupons (added GET endpoint)
  addCoupon, updateCoupon, deleteCoupon, getAllCoupons,
  // Reviews
  getAllReviews, deleteReview,
  // Addresses
  getAllAddresses, updateAddress, deleteAddress,
  // Carts
  getAllCarts, updateCart, deleteCart,
  // Wishlists
  getAllWishlists, updateWishlist, deleteWishlist
} = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

// Users
router.get('/users', adminAuth, getAllUsers);
router.put('/users/:id', adminAuth, updateUser);
router.delete('/users/:id', adminAuth, deleteUser);

// Categories
router.get('/categories', adminAuth, getCategories);
router.post('/categories', adminAuth, addCategory);
router.put('/categories/:id', adminAuth, updateCategory);
router.delete('/categories/:id', adminAuth, deleteCategory);

// Products
router.get('/products', adminAuth, getAllProducts); // <== New GET endpoint
router.post('/products', adminAuth, addProduct);
router.put('/products/:id', adminAuth, updateProduct);
router.delete('/products/:id', adminAuth, deleteProduct);

// Orders
router.get('/orders', adminAuth, getAllOrders);
router.put('/orders/:id', adminAuth, updateOrder);
router.delete('/orders/:id', adminAuth, deleteOrder);

// Coupons
router.get('/coupons', adminAuth, getAllCoupons); // <== New GET endpoint
router.post('/coupons', adminAuth, addCoupon);
router.put('/coupons/:id', adminAuth, updateCoupon);
router.delete('/coupons/:id', adminAuth, deleteCoupon);

// Reviews
router.get('/reviews', adminAuth, getAllReviews);
router.delete('/reviews/:id', adminAuth, deleteReview);

// Addresses
router.get('/addresses', adminAuth, getAllAddresses);
router.put('/addresses/:id', adminAuth, updateAddress);
router.delete('/addresses/:id', adminAuth, deleteAddress);

// Carts
router.get('/carts', adminAuth, getAllCarts);
router.put('/carts/:id', adminAuth, updateCart);
router.delete('/carts/:id', adminAuth, deleteCart);

// Wishlists
router.get('/wishlists', adminAuth, getAllWishlists);
router.put('/wishlists/:id', adminAuth, updateWishlist);
router.delete('/wishlists/:id', adminAuth, deleteWishlist);

module.exports = router;
