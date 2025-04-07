const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  categories: { type: [String], required: true },
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  price: { type: Number, required: true },
  returnAllowed: { type: Boolean, required: true },
  image: { type: String },  // URL to the image
  description: { type: String },
  sellerName: { type: String },
  sellerAddress: { type: String },
  countryOfOrigin: { type: String },
  shelfLife: { type: String }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
