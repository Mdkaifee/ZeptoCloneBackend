const mongoose = require('mongoose');
const { buildImageUrl } = require('../utils/staticImage');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imageUrl: {
      type: String,
      default: function defaultImage() {
        return buildImageUrl('categories', this._id || this.name);
      },
    },
    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MainCategory',
      required: true,
    },
  },
  { timestamps: true },
);

categorySchema.index({ name: 1, mainCategory: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
