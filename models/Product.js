const mongoose = require('mongoose');
const { buildImageUrl } = require('../utils/staticImage');

const UNIT_ENUM = ['g', 'gm', 'kg', 'ml', 'l', 'ltr', 'pcs', 'pack', 'unit'];

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    imageUrl: {
      type: String,
      default: function defaultImage() {
        return buildImageUrl('products', this._id || this.name);
      },
    },
    mainCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MainCategory',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true,
    },
    quantity: {
      value: { type: Number, required: true, min: 0 },
      unit: {
        type: String,
        enum: UNIT_ENUM,
        default: 'unit',
      },
    },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    returnAllowed: { type: Boolean, default: false },
    description: { type: String, default: '' },
    shelfLife: { type: String, default: '' },
    countryOfOrigin: { type: String, default: 'India' },
    sellerName: { type: String, default: '' },
    sellerAddress: { type: String, default: '' },
    specifications: {
      cpu: { type: String },
      ram: { type: String },
      storage: { type: String },
      gpu: { type: String },
      os: { type: String },
      additional: {
        type: Map,
        of: String,
        default: undefined,
      },
    },
  },
  { timestamps: true },
);

productSchema.index({ name: 1, subcategory: 1 }, { unique: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
