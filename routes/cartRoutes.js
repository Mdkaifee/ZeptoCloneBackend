const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addItemToCart);
router.get('/user/:userId', cartController.getUserCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:cartItemId', cartController.removeCartItem);
router.delete('/clear/:userId', cartController.clearUserCart);  // New route to clear the cart

module.exports = router;
