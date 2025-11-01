const Category = require('../models/Category');
const MainCategory = require('../models/MainCategory');

exports.getCategories = async (req, res) => {
  try {
    const { mainCategoryId } = req.query;
    const filter = {};

    if (mainCategoryId) {
      filter.mainCategory = mainCategoryId;
    }

    const categories = await Category.find(filter)
      .populate('mainCategory', 'name imageUrl')
      .select('name description imageUrl mainCategory')
      .sort({ name: 1 })
      .lean();

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, imageUrl, mainCategoryId } = req.body;

    if (!name || !mainCategoryId) {
      return res
        .status(400)
        .json({ message: 'Name and mainCategoryId are required' });
    }

    const parent = await MainCategory.findById(mainCategoryId);
    if (!parent) {
      return res.status(404).json({ message: 'Main category not found' });
    }

    const category = await Category.create({
      name: name.trim(),
      description,
      imageUrl,
      mainCategory: mainCategoryId,
    });

    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: 'Category already exists for this main category' });
    }
    res.status(500).json({ message: error.message });
  }
};
