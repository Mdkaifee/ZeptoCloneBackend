const MainCategory = require('../models/MainCategory');

exports.getMainCategories = async (req, res) => {
  try {
    const categories = await MainCategory.find({})
      .select('name description imageUrl')
      .sort({ name: 1 })
      .lean();

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMainCategory = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const existing = await MainCategory.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: 'Main category already exists' });
    }

    const category = await MainCategory.create({
      name: name.trim(),
      description,
      imageUrl,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
