const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
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
