const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  key: {
    type: String,
    enum: ['privacy_policy', 'terms_and_conditions'],
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

contentSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Content', contentSchema);
