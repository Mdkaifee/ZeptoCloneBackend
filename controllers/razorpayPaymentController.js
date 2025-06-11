
// const Razorpay = require('razorpay');

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID, // From .env file
//   key_secret: process.env.RAZORPAY_KEY_SECRET, // From .env file
// });

// const createRazorpayOrder = async (req, res) => {
//   const { amount } = req.body;  // Amount in INR

//   const options = {
//     amount: amount * 100,  // Convert amount to paise
//     currency: 'INR',
//     receipt: `order_receipt_${Date.now()}`,
//     payment_capture: 1,  // Auto capture payment after success
//   };

//   try {
//     const order = await razorpay.orders.create(options);
//     console.log("Order Created: ", order);  // Log the order details
//     res.json({ orderId: order.id, currency: order.currency });
//   } catch (error) {
//     console.error('Error creating Razorpay order:', error);  // Log error details
//     res.status(500).json({ error: 'Failed to create Razorpay order', details: error });
//   }
// };

// module.exports = { createRazorpayOrder };
// const Razorpay = require('razorpay');
// require('dotenv').config();  // Make sure dotenv is loaded

// // Log the environment variables to verify they are loaded
// console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
// console.log('Razorpay Key Secret:', process.env.RAZORPAY_KEY_SECRET);

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,  // Your Razorpay Key ID from .env file
//   key_secret: process.env.RAZORPAY_KEY_SECRET,  // Your Razorpay Key Secret from .env file
// });
// const createRazorpayOrder = async (req, res) => {
//   const { amount } = req.body;  // Amount in INR

//   if (!amount) {
//     return res.status(400).json({ error: 'Amount is required' });  // Check if amount is provided
//   }

//   const options = {
//     amount: amount * 100,  // Convert amount to paise (Razorpay expects amount in paise)
//     currency: 'INR',
//     receipt: `order_receipt_${Date.now()}`,
//     payment_capture: 1,  // Auto capture payment after success
//   };

//   try {
//     const order = await razorpay.orders.create(options);
//     res.json({ orderId: order.id, currency: order.currency });
//   } catch (error) {
//     console.error('Error creating Razorpay order:', error);
//     res.status(500).json({ error: 'Failed to create Razorpay order', details: error });
//   }
// };

// const Razorpay = require('razorpay');
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// const createRazorpayOrder = async (req, res) => {
//   const { amount } = req.body;  // Amount in INR

//   if (!amount) {
//     return res.status(400).json({ error: 'Amount is required' });
//   }

//   const options = {
//     amount: amount ,  // Convert amount to paise
//     currency: 'INR',
//     receipt: `order_receipt_${Date.now()}`,
//     payment_capture: 1,  // Auto capture payment after success
//   };

//   try {
//     const order = await razorpay.orders.create(options);
//     res.json({ orderId: order.id, currency: order.currency });
//   } catch (error) {
//     console.error('Error creating Razorpay order:', error);  // Log error details
//     res.status(500).json({ error: 'Failed to create Razorpay order', details: error });
//   }
// };

// module.exports = { createRazorpayOrder };
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,  // Your Razorpay key_id
  key_secret: process.env.RAZORPAY_KEY_SECRET,  // Your Razorpay key_secret
});

const createRazorpayOrder = async (req, res) => {
  const { amount } = req.body;  // Amount in INR (should be passed correctly)

  if (!amount) {
    return res.status(400).json({ error: 'Amount is required' });
  }

  // Ensure amount is passed as an integer (in paise)
  const amountInPaise = Math.round(amount);  // Convert to integer if it's not already

  const options = {
    amount: amountInPaise,  // Amount in paise (integer)
    currency: 'INR',
    receipt: `order_receipt_${Date.now()}`,
    payment_capture: 1,  // Auto capture payment after success
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, currency: order.currency });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order', details: error });
  }
};

module.exports = { createRazorpayOrder };
