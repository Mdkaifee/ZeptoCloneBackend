const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const createRazorpayOrder = async (req, res) => {
  const { amount, userId } = req.body;

  console.log("🔵 [Backend] Received request to create order:", { amount, userId });

  if (!amount || !userId) {
    console.error("🔴 [Backend] Amount is missing in request");
    return res.status(400).json({ error: 'Amount and UserId are required' });
  }
  const amountInPaise = Math.round(amount);
  console.log(`🟡 [Backend] Amount converted to paise: ${amountInPaise}`);

  const options = {
    amount: amount,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`, // shortened prefix
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    console.log("🟢 [Backend] Razorpay Order Created Successfully:", order);
    res.json({ orderId: order.id, currency: order.currency });
  } catch (error) {
    console.error('🔴 [Backend] Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create Razorpay order', details: error });
  }
};

module.exports = { createRazorpayOrder };
