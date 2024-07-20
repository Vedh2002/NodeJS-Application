
//Middle ware used for API Key verification which is generated during registration of user.
const ApiKey = require('../models/apikey');

const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).send({ message: 'API key is missing' });
  }

  try {
    const key = await ApiKey.findOne({ key: apiKey });
    if (!key) {
      return res.status(403).send({ message: 'Invalid API key' });
    }
    req.apiUserId = key.user_id;
    next();
  } catch (error) {
    console.error('API key verification error:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

module.exports = { verifyApiKey };
