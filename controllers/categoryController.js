const Product = require('../models/Product');

const normaliseCategoryInput = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((category) => (typeof category === 'string' ? category.trim() : ''))
      .filter(Boolean);
  }

  if (typeof value !== 'string') return [];

  return value
    .split(',')
    .map((category) => category.trim())
    .filter(Boolean);
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $unwind: '$categories' },
      {
        $group: {
          _id: { $toLower: '$categories' },
          label: { $first: '$categories' },
          productCount: { $sum: 1 },
        },
      },
      { $sort: { label: 1 } },
    ]);

    res.json(
      categories.map((category) => ({
        name: category.label,
        productCount: category.productCount,
      })),
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductsForCategory = async (req, res) => {
  try {
    const rawCategory = req.params.category ?? req.query.category;
    const categoriesToMatch = normaliseCategoryInput(rawCategory);

    if (!categoriesToMatch.length) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const products = await Product.find({
      categories: { $in: categoriesToMatch },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

