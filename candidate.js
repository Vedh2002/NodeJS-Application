const express = require('express');
const Candidate = require('../models/candidate');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
//Candidate route to add candidate details.
router.post('/candidate', authMiddleware, async (req, res) => {
  const { first_name, last_name, email } = req.body;
  const candidate = new Candidate({ first_name, last_name, email, user_id: req.user.id });
  await candidate.save();
  res.status(201).send({ message: 'Candidate added' });
});
//candidate route to get candidate details.
router.get('/candidate', authMiddleware, async (req, res) => {
  const candidates = await Candidate.find({ user_id: req.user.id });
  res.send(candidates);
});

module.exports = router;
