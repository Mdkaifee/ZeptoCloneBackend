const express = require('express');
require('dotenv').config();
const dbConnection = require('./config/db');

const app = express();

app.use(express.json());

dbConnection(); // Initialize the database connection

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
