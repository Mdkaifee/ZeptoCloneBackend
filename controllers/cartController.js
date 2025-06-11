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
// exports.updateCartItem = async (req, res) => {
//     const { cartItemId, quantityChange } = req.body;
//     try {
//         const cartItem = await CartItem.findById(cartItemId);
//         if (!cartItem) {
//             return res.status(404).json({ message: 'Cart item not found', cartItemId: null });
//         }

//         const newQuantity = cartItem.quantity + quantityChange;
//         if (newQuantity <= 0) {
//             await CartItem.findByIdAndDelete(cartItemId);
//             res.json({ message: 'Item removed from cart', cartItemId: cartItemId.toString() });
//         } else {
//             cartItem.quantity = newQuantity;
//             await cartItem.save();
//             res.json({ message: 'Item quantity updated in cart', cartItemId: cartItemId.toString() });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error.message, cartItemId: null });
//     }
// };
exports.updateCartItem = async (req, res) => {
  const { cartItemId, quantityChange } = req.body;

  try {
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found', cartItemId: null });
    }

    const newQuantity = cartItem.quantity + quantityChange;
    console.log(`Cart Item ID: ${cartItemId}, Current Quantity: ${cartItem.quantity}, Quantity Change: ${quantityChange}, New Quantity: ${newQuantity}`);

    if (newQuantity <= 0) {
      console.log(`Quantity is zero or negative. Deleting Cart Item: ${cartItemId}`);
      await CartItem.findByIdAndDelete(cartItemId);  // Delete the cart item if quantity is 0 or less
      res.json({ message: 'Item removed from cart', cartItemId: cartItemId.toString() });
    } else {
      cartItem.quantity = newQuantity;
      await cartItem.save();
      res.json({ message: 'Item quantity updated in cart', cartItemId: cartItemId.toString() });
    }
  } catch (error) {
    console.error("Error in updateCartItem:", error); // Log the error in the backend
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


// exports.removeCartItem = async (req, res) => {
//   try {
//     const cartItemId = req.params.cartItemId;
//     await CartItem.findByIdAndDelete(cartItemId);
//     res.json({ message: 'Item removed from cart' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.removeCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.cartItemId;

    // Find the cart item by ID
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Decrease the quantity by 1, instead of removing it completely
    if (cartItem.quantity > 1) {
      // Reduce the quantity by 1
      cartItem.quantity -= 1;
      await cartItem.save();

      return res.json({
        message: 'Item quantity reduced in cart',
        cartItemId: cartItemId,
        remainingQuantity: cartItem.quantity,  // Return the remaining quantity
      });
    } else {
      // If the quantity is 1, we will delete the item
      await CartItem.findByIdAndDelete(cartItemId);

      // Respond with the item removed
      return res.json({
        message: 'Item removed from cart',
        cartItemId: cartItemId,
        remainingQuantity: 0,  // No more quantity left
      });
    }

  } catch (error) {
    console.error("Error in removeCartItem:", error);
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

  