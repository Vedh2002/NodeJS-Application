const express = require('express');
const User = require('../models/user');
const Candidate = require('../models/candidate');
const { verifyApiKey } = require('../middleware/apiKeyAuth');

const router = express.Router();
// Public api route to get profile (i.e user details by using API Key.)
router.post('/public/profile', verifyApiKey, async (req, res) => {
  try {
    const user = await User.findById(req.apiUserId).select('-password_hash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Public api route to get candidate details (i.e Candidates registered by user with API Key)
router.get('/public/candidate', verifyApiKey, async (req, res) => {
  try {
    const candidates = await Candidate.find({ user_id: req.apiUserId });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
