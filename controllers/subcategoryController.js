const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');

exports.getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const filter = {};

    if (categoryId) {
      filter.category = categoryId;
    }

    const subcategories = await Subcategory.find(filter)
      .populate({
        path: 'category',
        select: 'name imageUrl',
        populate: { path: 'mainCategory', select: 'name imageUrl' },
      })
      .select('name description imageUrl category')
      .sort({ name: 1 })
      .lean();

    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    const { name, description, imageUrl, categoryId } = req.body;

    if (!name || !categoryId) {
      return res
        .status(400)
        .json({ message: 'Name and categoryId are required' });
    }

    const parentCategory = await Category.findById(categoryId).populate(
      'mainCategory',
      'name imageUrl',
    );

    if (!parentCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = await Subcategory.create({
      name: name.trim(),
      description,
      imageUrl,
      category: categoryId,
    });

    await subcategory.populate({
      path: 'category',
      select: 'name imageUrl',
      populate: { path: 'mainCategory', select: 'name imageUrl' },
    });

    res.status(201).json(subcategory);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: 'Subcategory already exists for this category' });
    }
    res.status(500).json({ message: error.message });
  }
};
