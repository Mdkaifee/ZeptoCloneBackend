const express = require('express');
const {
  addOrUpdateReview,
  getProductReviews,
  deleteReview,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.post('/:productId', addOrUpdateReview);
router.get('/:productId', getProductReviews);
router.delete('/:reviewId', deleteReview);

module.exports = router;


