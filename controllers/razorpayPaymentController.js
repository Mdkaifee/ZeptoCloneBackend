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
