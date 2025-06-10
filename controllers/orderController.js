const Order = require('../models/Order');
const Product = require('../models/Product');
// Create a new order
exports.createOrder = async (req, res) => {
  const { userId, cartItems, totalAmount, paymentStatus, orderStatus } = req.body;

  try {
    // Process each cart item and calculate the total
    let cartItemsDetails = [];
    let totalAmountCalculated = 0;

    for (let item of cartItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product not found for ID ${item.product}` });
      }

      const itemTotal = product.price * item.quantity;
      cartItemsDetails.push({
        product: product._id,
        quantity: item.quantity,
        totalAmount: itemTotal
      });

      totalAmountCalculated += itemTotal;
    }

    // Create the new order
    const newOrder = new Order({
      user: userId,
      cartItems: cartItemsDetails,
      totalAmount: totalAmountCalculated,
      paymentStatus: paymentStatus || 'Pending', // Default to 'Pending' if not specified
      orderStatus: orderStatus || 'Ordered'  // Default to 'Ordered'
    });

    // Save the order to the database
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  const { orderId, paymentStatus } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { paymentStatus }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;  // Get orderId from the request parameters

  try {
    const order = await Order.findById(orderId).populate('cartItems.product');  // Populate product details if needed
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve order' });
  }
};
// Get orders by userId
exports.getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;  // Get userId from the request parameters

  try {
    const orders = await Order.find({ user: userId }).populate('cartItems.product');  // Populate product details if needed
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve orders' });
  }
};
