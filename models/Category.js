const mongoose = require('mongoose');

// Define the schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

// Export the model, reusing if already compiled
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
module.exports = Category;