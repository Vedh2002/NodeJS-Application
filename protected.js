const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
// protected route to access using JWT Token Generated during login
router.get('/protected', auth, (req, res) => {
  res.send({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
