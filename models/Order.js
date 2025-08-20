const mongoose = require('mongoose');
const Product = require('./Product');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    priceAtOrder: { type: Number, required: true },
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  trackingNumber: { type: String },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { 
    type: String, 
    enum: ['Credit Card', 'PayPal', 'Pay on Delivery', 'Cash'],
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save middleware to check and update stock
orderSchema.pre('save', async function(next) {
  try {
    if (this.isNew) { // Only check on new orders
      for (const item of this.items) {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product ${item.product} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
        }
        // Deduct stock immediately upon order placement
        product.stock -= item.quantity;
        await product.save();
        console.log(`Deducted ${item.quantity} from ${product.name}. New stock: ${product.stock}`);
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Post-save middleware to handle cancellations (restore stock)
orderSchema.post('save', async function(doc, next) {
  try {
    if (this.isModified('status') && doc.status === 'Cancelled') {
      for (const item of doc.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
          console.log(`Restored ${item.quantity} to ${product.name}. New stock: ${product.stock}`);
        }
      }
    }
    next();
  } catch (err) {
    console.error('Stock Restoration Error:', err.message);
    next(err);
  }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
module.exports = Order;