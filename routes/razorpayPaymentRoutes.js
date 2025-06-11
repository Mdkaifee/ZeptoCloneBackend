const express = require('express');
const router = express.Router();
const { createRazorpayOrder } = require('../controllers/razorpayPaymentController');

// Route to create Razorpay order
router.post('/create-order', createRazorpayOrder);  // This should be the correct path

module.exports = router;
