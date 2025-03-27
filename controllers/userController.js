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
