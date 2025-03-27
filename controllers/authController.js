const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.signup = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send('User already registered');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      mobile: `${mobile}`,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send('User not found');
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).send('Invalid credentials');
  
      // Create token
      const payload = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile
        }
      };
  
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },  // Token expires in one hour
        (err, token) => {
          if (err) throw err;
          res.json({ token, user: payload.user });
        }
      );
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

exports.logout = async (req, res) => {
  // Implement logout logic (e.g., clearing the session or token)
  res.status(200).send('User logged out successfully');
};
