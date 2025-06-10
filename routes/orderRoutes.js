const express = require('express');
const { createOrder, updatePaymentStatus,getOrdersByUserId, updateOrderStatus, getOrderById } = require('../controllers/orderController');
const router = express.Router();

// Create a new order
router.post('/', createOrder);

// Get order by ID
router.get('/:orderId', getOrderById);  // Make sure this line exists

// Update payment status
router.put('/payment', updatePaymentStatus);

// Update order status
router.put('/status', updateOrderStatus);
router.get('/user/:userId', getOrdersByUserId);
module.exports = router;
