const express = require('express');
const {
  getMainCategories,
  createMainCategory,
} = require('../controllers/mainCategoryController');

const router = express.Router();

router.get('/', getMainCategories);
router.post('/', createMainCategory);

module.exports = router;
