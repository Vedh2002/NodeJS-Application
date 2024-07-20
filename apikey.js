
//API Key Schema to store api keys that are generated.
const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('ApiKey', apiKeySchema);
