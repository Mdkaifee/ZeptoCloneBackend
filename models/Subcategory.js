const mongoose = require('mongoose');
const { buildImageUrl } = require('../utils/staticImage');

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imageUrl: {
      type: String,
      default: function defaultImage() {
        return buildImageUrl('subcategories', this._id || this.name);
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true },
);

subcategorySchema.index({ name: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Subcategory', subcategorySchema);
