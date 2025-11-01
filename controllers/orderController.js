const Order = require('../models/Order');
const Product = require('../models/Product');
// Create a new order
exports.createOrder = async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const { userId, cartItems, paymentStatus, orderStatus } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: 'Cart items are required to create an order' });
    }

    const cartItemsDetails = [];
    let totalAmountCalculated = 0;

    for (const item of cartItems) {
      const productRef = item?.product;
      const productId =
        typeof productRef === 'string'
          ? productRef
          : productRef?._id || productRef?.id;

      if (!productId) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: 'Invalid product reference in cart item' });
      }

      const product = await Product.findById(productId).session(session);

      if (!product) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: `Product not found for ID ${productId}` });
      }

      const quantityRaw = item?.quantity;
      const quantity =
        typeof quantityRaw === 'object'
          ? Number(quantityRaw.value)
          : Number(quantityRaw);

      if (!Number.isFinite(quantity) || quantity <= 0) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(400)
          .json({ message: `Invalid quantity for product ${productId}` });
      }

      if (product.stock < quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name}. Available: ${product.stock}`,
        });
      }

      const itemTotal = product.price * quantity;

      cartItemsDetails.push({
        product: product._id,
        quantity,
        productAmount: itemTotal,
      });

      totalAmountCalculated += itemTotal;

      product.stock -= quantity;
      await product.save({ session });
    }

    const newOrder = await Order.create(
      [
        {
          user: userId,
          cartItems: cartItemsDetails,
          totalAmount: totalAmountCalculated,
          paymentStatus: paymentStatus || 'Pending',
          orderStatus: orderStatus || 'Ordered',
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newOrder[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
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
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const { orderId, orderStatus } = req.body;
    const allowedStatuses = ['Ordered', 'Cancelled', 'Delivered'];

    if (!allowedStatuses.includes(orderStatus)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Invalid order status value' });
    }

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.orderStatus;
    order.orderStatus = orderStatus;
    await order.save({ session });

    const shouldRestock =
      previousStatus !== 'Cancelled' && orderStatus === 'Cancelled';

    if (shouldRestock) {
      for (const item of order.cartItems) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } },
          { session },
        );
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.json(order);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
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
      return res.status(200).json([]);
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retrieve orders' });
  }
};
