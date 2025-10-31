const mongoose = require('mongoose');
const User = require('../models/User');

const sanitizeInput = (value, fallback = null) => {
  if (typeof value !== 'string') {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
};

exports.getAddressesByUser = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(userId).select('addresses');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user.addresses || []);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch addresses' });
  }
};

exports.addAddress = async (req, res) => {
  const {
    userId,
    buildingName,
    area,
    landmark,
    city,
    pincode,
    state,
    label,
    receiverName,
    phone
  } = req.body || {};

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const requiredFields = { buildingName, area, city, pincode, state, label };
  const missingField = Object.entries(requiredFields).find(
    ([, value]) => !sanitizeInput(value)
  );

  if (missingField) {
    return res.status(400).json({
      message: `${missingField[0]} is required`
    });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resolvedReceiverName = sanitizeInput(receiverName, user.name);
    const resolvedPhone = sanitizeInput(phone, user.mobile);

    const newAddress = {
      buildingName: sanitizeInput(buildingName),
      area: sanitizeInput(area),
      landmark: sanitizeInput(landmark, null),
      city: sanitizeInput(city),
      pincode: sanitizeInput(pincode),
      state: sanitizeInput(state),
      label: sanitizeInput(label),
      receiverName: resolvedReceiverName,
      phone: resolvedPhone
    };

    user.addresses.push(newAddress);
    await user.save();

    const createdAddress = user.addresses[user.addresses.length - 1];

    return res.status(201).json({
      message: 'Address added successfully',
      address: createdAddress,
      addresses: user.addresses
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to add address' });
  }
};

exports.updateAddress = async (req, res) => {
  const { userId, addressId } = req.params;
  const updates = req.body || {};

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(addressId)) {
    return res.status(400).json({ message: 'Invalid user or address ID' });
  }

  const fields = [
    'buildingName',
    'area',
    'landmark',
    'city',
    'pincode',
    'state',
    'label',
    'receiverName',
    'phone'
  ];

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    let hasUpdates = false;

    for (const field of fields) {
      if (!Object.prototype.hasOwnProperty.call(updates, field)) {
        continue;
      }

      let sanitizedValue;

      if (field === 'landmark') {
        sanitizedValue = sanitizeInput(updates[field], null);
        address[field] = sanitizedValue;
        hasUpdates = true;
        continue;
      }

      if (field === 'receiverName') {
        sanitizedValue = sanitizeInput(updates[field], user.name);
        address[field] = sanitizedValue || user.name;
        hasUpdates = true;
        continue;
      }

      if (field === 'phone') {
        sanitizedValue = sanitizeInput(updates[field], user.mobile);
        address[field] = sanitizedValue || user.mobile;
        hasUpdates = true;
        continue;
      }

      sanitizedValue = sanitizeInput(updates[field]);

      if (!sanitizedValue) {
        return res.status(400).json({ message: `${field} cannot be empty` });
      }

      address[field] = sanitizedValue;
      hasUpdates = true;
    }

    if (!hasUpdates) {
      return res.status(400).json({ message: 'No valid fields provided to update' });
    }

    await user.save();

    return res.json({
      message: 'Address updated successfully',
      address
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update address' });
  }
};

exports.deleteAddress = async (req, res) => {
  const { userId, addressId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(addressId)) {
    return res.status(400).json({ message: 'Invalid user or address ID' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    address.deleteOne();
    await user.save();

    return res.json({
      message: 'Address deleted successfully',
      addresses: user.addresses
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete address' });
  }
};
