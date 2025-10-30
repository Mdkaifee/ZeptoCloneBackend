const express = require('express');
const {
  getCategories,
  getProductsForCategory,
} = require('../controllers/categoryController');

const router = express.Router();

router.get('/', getCategories);
router.get('/products', getProductsForCategory); // supports ?category=Electronics
router.get('/:category/products', getProductsForCategory);

module.exports = router;

