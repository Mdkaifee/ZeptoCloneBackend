const express = require('express');
const {
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getDistinctCategories,
  getProductsByCategory
} = require('../controllers/productController');

const router = express.Router();

// Specific routes first
router.get('/categories', getDistinctCategories); // Route to get distinct categories
router.get('/by-category/:category', getProductsByCategory);  // Route to get products by category

// General CRUD routes
router.post('/', addProduct);
router.get('/:id', getProduct); // This could mistakenly capture '/categories' as ':id'
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/', getAllProducts);  // Route to get all products

module.exports = router;
