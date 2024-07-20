
//Route for user registration and login (an extra feature is added for protected 
// profile view.)
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const ApiKey = require('../models/apikey');

const router = express.Router();
// Registartion route
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    console.log('Register request received:', req.body);

    if (!password) {
      return res.status(400).send({ message: 'Password is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    console.log('Password hash:', password_hash); // Log password hash for debugging

    const user = new User({ first_name, last_name, email, password_hash });
    await user.save();

    // This will Generate API key for the new user
    const apiKey = crypto.randomBytes(32).toString('hex');
    const newApiKey = new ApiKey({ key: apiKey, user_id: user._id });
    await newApiKey.save();

    res.status(201).send({ message: 'User registered', apiKey });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send({ message: 'Error registering user', error: error.message });
  }
});
// This route is for user Login.
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request received:', req.body); // Log request body for debugging

    if (!password) {
      return res.status(400).send({ message: 'Password is required' });
    }

    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password_hash)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.send({ token });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send({ message: 'Error logging in', error: error.message });
  }
});

const auth = require('../middleware/auth');
// (This route is optional feature to view protected profile)
router.get('/protected/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
