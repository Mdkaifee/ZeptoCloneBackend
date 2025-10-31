const express = require('express');
const {
  getAddressesByUser,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/addressController');

const router = express.Router();

router.get('/:userId', getAddressesByUser);
router.post('/', addAddress);
router.patch('/:userId/:addressId', updateAddress);
router.delete('/:userId/:addressId', deleteAddress);

module.exports = router;
