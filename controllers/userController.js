const User = require('../models/User');
const mongoose = require('mongoose');

exports.editProfile = async (req, res) => {
    const { name, mobile } = req.body;
    const { id } = req.params;  // Grabbing the ID from the URL
  
    // Checking if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid user ID format');
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(id, {
        name,
        mobile: `${mobile}`
      }, { new: true });
  
      if (!updatedUser) {
        return res.status(404).send('User not found');
      }
  
      res.json({ message: "Profile updated successfully", updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.softDeleteAccount = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body || {};

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID format' });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isDeleted) {
      return res.status(200).json({
        message: 'Account already deleted',
        user: {
          _id: user._id,
          isDeleted: user.isDeleted,
          deletedAt: user.deletedAt
        }
      });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    user.deleteReason = reason || user.deleteReason;
    await user.save();

    return res.json({
      message: 'Account marked as deleted',
      user: {
        _id: user._id,
        isDeleted: user.isDeleted,
        deletedAt: user.deletedAt
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to delete account' });
  }
};
