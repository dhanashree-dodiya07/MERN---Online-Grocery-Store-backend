# Dhanashree Backend

This is the backend for the Dhanashree V1.1 project, built with Node.js and Express. It provides RESTful APIs for user and admin management, product catalog, cart, orders, reviews, wishlist, coupons, and more.

## Features
- User authentication and authorization
- Admin authentication and authorization
- Product management (CRUD)
- Category management
- Cart and wishlist functionality
- Order processing
- Coupon management
- Review system

## Project Structure
```
Backend/
├── package.json
├── server.js
├── config/
│   └── db.js
├── controllers/
│   ├── adminController.js
│   └── userController.js
├── middleware/
│   ├── adminAuth.js
│   └── auth.js
├── models/
│   ├── Address.js
│   ├── Cart.js
│   ├── Category.js
│   ├── Coupon.js
│   ├── Order.js
│   ├── Product.js
│   ├── Review.js
│   ├── User.js
│   └── Wishlist.js
├── routes/
│   ├── adminRoutes.js
│   └── userRoutes.js
```

## Getting Started

### Prerequisites
- Node.js (v14 or above)
- npm
- MongoDB

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the backend folder:
   ```
   cd Dhanashree_V1.1/Backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Configure your MongoDB connection in `config/db.js`.
5. Start the server:
   ```
   node server.js
   ```

## API Endpoints
- User routes: `/api/user/*`
- Admin routes: `/api/admin/*`
- Product routes: `/api/product/*`
- Category routes: `/api/category/*`
- Cart routes: `/api/cart/*`
- Order routes: `/api/order/*`
- Coupon routes: `/api/coupon/*`
- Review routes: `/api/review/*`
- Wishlist routes: `/api/wishlist/*`

Refer to the controllers and routes for detailed API usage.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
