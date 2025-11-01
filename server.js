const express = require('express');
const path = require('path');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const dbConnection = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const razorpayPaymentRoutes = require('./routes/razorpayPaymentRoutes');  // Import Razorpay routes
const orderRoutes = require('./routes/orderRoutes'); // Add this line
const categoryRoutes = require('./routes/categoryRoutes');
const mainCategoryRoutes = require('./routes/mainCategoryRoutes');
const subcategoryRoutes = require('./routes/subcategoryRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const contentRoutes = require('./routes/contentRoutes');
const addressRoutes = require('./routes/addressRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yml'));
const app = express();

app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

dbConnection(); // Initialize the database connection

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

//Routes
app.get('/', (req, res) => {
  res.send('Quick Basket backend server is running 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/main-categories', mainCategoryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', razorpayPaymentRoutes); 
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/reviews', reviewRoutes);
app.get('/', (req, res) => {
  res.send('Quick Basket Backend is running...');
});
const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
