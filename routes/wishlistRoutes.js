const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');

const router = express.Router();

router.get('/:userId', getWishlist);
router.post('/', addToWishlist);
router.delete('/:userId/:productId', removeFromWishlist);

module.exports = router;
