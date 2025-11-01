const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

const hasUserPurchasedProduct = async (userId, productId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
    orderStatus: 'Delivered',
    'cartItems.product': productId,
  });

  return order;
};

exports.addOrUpdateReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, orderId, rating, comment } = req.body;

    if (!userId || !orderId || !rating) {
      return res
        .status(400)
        .json({ message: 'userId, orderId and rating are required' });
    }

    if (!Number.isFinite(Number(rating)) || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: 'Rating must be between 1 and 5' });
    }

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const order = await hasUserPurchasedProduct(userId, productId, orderId);
    if (!order) {
      return res
        .status(403)
        .json({ message: 'Delivered order is required before leaving a review' });
    }

    const review = await Review.findOneAndUpdate(
      { user: userId, product: productId },
      {
        rating: Number(rating),
        comment: comment?.trim() || '',
        order: orderId,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).populate('user', 'name');

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || 'Failed to submit review' });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: error.message || 'Failed to fetch reviews' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Failed to delete review' });
  }
};

