const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

exports.getWishlist = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId).populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve wishlist' });
  }
};

exports.addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid user or product ID' });
  }

  try {
    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyInWishlist = user.wishlist.some(
      (item) => item.toString() === productId
    );

    if (alreadyInWishlist) {
      await user.populate('wishlist');
      return res.status(200).json({
        message: 'Product already in wishlist',
        wishlist: user.wishlist
      });
    }

    user.wishlist.push(productId);
    await user.save();
    await user.populate('wishlist');

    res.status(201).json({
      message: 'Product added to wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add product to wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: 'Invalid user or product ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const initialLength = user.wishlist.length;
    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );

    if (initialLength === user.wishlist.length) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    await user.save();
    await user.populate('wishlist');

    res.json({
      message: 'Product removed from wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to remove product from wishlist' });
  }
};
