// Index file (to start the project and assign all the routes.)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const candidateRoutes = require('./routes/candidate');
const publicApiRoutes = require('./routes/publicApi');
const protectedRoutes = require('./routes/protected');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', candidateRoutes);
app.use('/api', publicApiRoutes);
app.use('/api', protectedRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
