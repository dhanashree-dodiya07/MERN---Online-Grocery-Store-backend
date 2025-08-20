const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  actualPrice: { 
    type: Number, 
    required: true, 
    min: [0, 'Actual price cannot be negative'] 
  },
  discountedPrice: { 
    type: Number, 
    required: true, 
    min: [0, 'Discounted price cannot be negative'] 
  },
  discountPercentage: { 
    type: Number, 
    default: 0, 
    min: [0, 'Discount percentage cannot be negative'], 
    max: [100, 'Discount percentage cannot exceed 100'] 
  },
  stock: { 
    type: Number, 
    required: true, 
    min: [0, 'Stock cannot be negative'] 
  },
  lowStockThreshold: { 
    type: Number, 
    default: 10, 
    min: [0, 'Low stock threshold cannot be negative'] 
  },
  image: { type: String, required: true, trim: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  avgRating: { 
    type: Number, 
    default: 0, 
    min: [0, 'Rating cannot be negative'], 
    max: [5, 'Rating cannot exceed 5'] 
  },
  numReviews: { 
    type: Number, 
    default: 0, 
    min: [0, 'Number of reviews cannot be negative'] 
  },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to calculate discountPercentage
productSchema.pre('save', function (next) {
  try {
    if (this.isModified('actualPrice') || this.isModified('discountedPrice')) {
      // Prevent division by zero and ensure actualPrice is positive
      if (this.actualPrice <= 0) {
        return next(new Error('Actual price must be greater than zero to calculate discount percentage'));
      }
      // Calculate discount percentage
      const discount = ((this.actualPrice - this.discountedPrice) / this.actualPrice) * 100;
      // Ensure discountPercentage stays within 0-100 range and round it
      this.discountPercentage = Math.round(Math.max(0, Math.min(100, discount)));
    }
    // Validate discountedPrice doesn't exceed actualPrice
    if (this.discountedPrice > this.actualPrice) {
      return next(new Error('Discounted price cannot exceed actual price'));
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Add index for faster queries
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });

// Export the model, reusing if already compiled
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
module.exports = Product;