const express = require('express');
const {
  getSubcategories,
  createSubcategory,
} = require('../controllers/subcategoryController');

const router = express.Router();

router.get('/', getSubcategories);
router.post('/', createSubcategory);

module.exports = router;
