const Product = require('../models/Product');
const MainCategory = require('../models/MainCategory');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

const idsEqual = (a, b) =>
  a && b && a.toString && b.toString && a.toString() === b.toString();

const ensureHierarchy = async ({ mainCategoryId, categoryId, subcategoryId }) => {
  const subcategory = await Subcategory.findById(subcategoryId)
    .populate({
      path: 'category',
      populate: { path: 'mainCategory' },
    })
    .exec();

  if (!subcategory) {
    return { error: { status: 404, message: 'Subcategory not found' } };
  }

  const category = categoryId
    ? await Category.findById(categoryId).populate('mainCategory').exec()
    : subcategory.category;

  if (!category) {
    return { error: { status: 404, message: 'Category not found' } };
  }

  const subcategoryCategoryId =
    subcategory.category?._id || subcategory.category;

  if (!idsEqual(subcategoryCategoryId, category._id)) {
    return {
      error: {
        status: 400,
        message: 'Subcategory does not belong to the provided category',
      },
    };
  }

  const mainCategory = mainCategoryId
    ? await MainCategory.findById(mainCategoryId).exec()
    : category.mainCategory;

  if (!mainCategory) {
    return { error: { status: 404, message: 'Main category not found' } };
  }

  const categoryMainCategoryId =
    category.mainCategory?._id || category.mainCategory;

  if (!idsEqual(categoryMainCategoryId, mainCategory._id)) {
    return {
      error: {
        status: 400,
        message: 'Category does not belong to the provided main category',
      },
    };
  }

  return { subcategory, category, mainCategory };
};

exports.addProduct = async (req, res) => {
  try {
    const {
      mainCategoryId,
      categoryId,
      subcategoryId,
      name,
      quantity,
      price,
      returnAllowed,
      description,
      shelfLife,
      countryOfOrigin,
      sellerName,
      sellerAddress,
      imageUrl,
      specifications,
    } = req.body;

    if (!subcategoryId) {
      return res
        .status(400)
        .json({ message: 'subcategoryId is required to create a product' });
    }

    if (!name || !quantity?.value || !quantity?.unit || price == null) {
      return res.status(400).json({
        message:
          'name, quantity.value, quantity.unit, price, and category references are required',
      });
    }

    const hierarchy = await ensureHierarchy({
      mainCategoryId,
      categoryId,
      subcategoryId,
    });

    if (hierarchy.error) {
      return res
        .status(hierarchy.error.status)
        .json({ message: hierarchy.error.message });
    }

    const product = await Product.create({
      name,
      quantity,
      price,
      returnAllowed,
      description,
      shelfLife,
      countryOfOrigin,
      sellerName,
      sellerAddress,
      imageUrl,
      specifications,
      mainCategory: hierarchy.mainCategory._id,
      category: hierarchy.category._id,
      subcategory: hierarchy.subcategory._id,
    });

    await product.populate([
      { path: 'mainCategory', select: 'name imageUrl' },
      { path: 'category', select: 'name imageUrl' },
      { path: 'subcategory', select: 'name imageUrl' },
    ]);

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { mainCategoryId, categoryId, subcategoryId } = req.query;
    const filter = {};

    if (mainCategoryId) {
      filter.mainCategory = mainCategoryId;
    }
    if (categoryId) {
      filter.category = categoryId;
    }
    if (subcategoryId) {
      filter.subcategory = subcategoryId;
    }

    const products = await Product.find(filter)
      .populate([
        { path: 'mainCategory', select: 'name imageUrl' },
        { path: 'category', select: 'name imageUrl' },
        { path: 'subcategory', select: 'name imageUrl' },
      ])
      .lean();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate([
      { path: 'mainCategory', select: 'name imageUrl' },
      { path: 'category', select: 'name imageUrl' },
      { path: 'subcategory', select: 'name imageUrl' },
    ]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { mainCategoryId, categoryId, subcategoryId, ...rest } = req.body;
    let updates = { ...rest };

    if (subcategoryId || categoryId || mainCategoryId) {
      const hierarchy = await ensureHierarchy({
        mainCategoryId,
        categoryId,
        subcategoryId,
      });

      if (hierarchy.error) {
        return res
          .status(hierarchy.error.status)
          .json({ message: hierarchy.error.message });
      }

      updates = {
        ...updates,
        mainCategory: hierarchy.mainCategory._id,
        category: hierarchy.category._id,
        subcategory: hierarchy.subcategory._id,
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true },
    ).populate([
      { path: 'mainCategory', select: 'name imageUrl' },
      { path: 'category', select: 'name imageUrl' },
      { path: 'subcategory', select: 'name imageUrl' },
    ]);

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
