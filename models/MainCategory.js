const mongoose = require('mongoose');
const mainCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('MainCategory', mainCategorySchema);
