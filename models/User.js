const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  buildingName: { type: String, required: true, trim: true },
  area: { type: String, required: true, trim: true },
  landmark: { type: String, trim: true, default: null },
  city: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  label: { type: String, required: true, trim: true },
  receiverName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  addresses: {
    type: [addressSchema],
    default: []
  },
  wishlist: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    default: []
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  deleteReason: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('User', userSchema);
