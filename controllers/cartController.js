const CartItem = require('../models/CartItem');

exports.addItemToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be greater than 0." });
    }

    try {
        let item = await CartItem.findOne({ user: userId, product: productId });
        if (item) {
            item.quantity += quantity;
            await item.save();
            res.status(200).json({ 
              message: 'Item quantity updated in cart', 
              cartItemId: item._id.toString()  // <-- Ensure always present
            });
        } else {
            const newItem = new CartItem({ user: userId, product: productId, quantity });
            await newItem.save();
            res.status(201).json({ 
              message: 'Item added to cart', 
              cartItemId: newItem._id.toString() 
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to update the quantity of a cart item
exports.updateCartItem = async (req, res) => {
    const { cartItemId, quantityChange } = req.body;
    try {
        const cartItem = await CartItem.findById(cartItemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found', cartItemId: null });
        }

        const newQuantity = cartItem.quantity + quantityChange;
        if (newQuantity <= 0) {
            await CartItem.findByIdAndDelete(cartItemId);
            res.json({ message: 'Item removed from cart', cartItemId: cartItemId.toString() });
        } else {
            cartItem.quantity = newQuantity;
            await cartItem.save();
            res.json({ message: 'Item quantity updated in cart', cartItemId: cartItemId.toString() });
        }
    } catch (error) {
        res.status(400).json({ message: error.message, cartItemId: null });
    }
};

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cartItems = await CartItem.find({ user: userId }).populate('product');
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.removeCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.cartItemId;
    await CartItem.findByIdAndDelete(cartItemId);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.clearUserCart = async (req, res) => {
    try {
      const userId = req.params.userId;  // Assume you'll pass the user ID as a parameter
      await CartItem.deleteMany({ user: userId });
      res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  