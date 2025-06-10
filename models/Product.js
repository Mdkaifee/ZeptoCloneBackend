const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  categories: { type: [String], required: true },
  name: { type: String, required: true },
  quantity: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['kg', 'g', 'ltr', 'ml', 'pcs', 'lb', 'unit'], default: 'unit' }
  },
  price: { type: Number, required: true },
  returnAllowed: { type: Boolean, required: true },
  image: { type: String },
  description: { type: String },
  sellerName: { type: String },
  sellerAddress: { type: String },
  countryOfOrigin: { type: String },
  shelfLife: { type: String },

  // 👇 New CPU or general technical specs section
  technicalDetails: {
    cpu: { type: String },
    ram: { type: String },
    storage: { type: String },
    gpu: { type: String },
    os: { type: String }
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
