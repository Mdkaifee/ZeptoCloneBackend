const express = require('express');
require('dotenv').config();
const dbConnection = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const razorpayPaymentRoutes = require('./routes/razorpayPaymentRoutes');  // Import Razorpay routes
const orderRoutes = require('./routes/orderRoutes'); // Add this line
const categoryRoutes = require('./routes/categoryRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const contentRoutes = require('./routes/contentRoutes');
const app = express();

app.use(express.json());

dbConnection(); // Initialize the database connection

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

//Routes
app.get('/', (req, res) => {
  res.send('Zepto backend server is running 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', razorpayPaymentRoutes); 
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/content', contentRoutes);
app.get('/', (req, res) => {
  res.send('Zepto Clone Backend is running...');
});
const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
