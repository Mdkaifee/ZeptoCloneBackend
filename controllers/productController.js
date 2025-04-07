const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find({});
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.getDistinctCategories = async (req, res) => {
    try {
      console.log("Fetching distinct categories...");
      const categories = await Product.distinct("categories");
      console.log("Categories found:", categories);
      res.json(categories);
    } catch (error) {
      console.error("Error in getDistinctCategories:", error);
      res.status(500).json({ message: error.message });
    }
  };
  
  
exports.getProductsByCategory = async (req, res) => {
    try {
      const products = await Product.find({ categories: req.params.category });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };  
  