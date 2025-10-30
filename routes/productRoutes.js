const express = require('express');
const {
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require('../controllers/productController');

const router = express.Router();

router.post('/', addProduct);
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;

