const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const helmet = require('helmet');

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

const rateLimit = require('./middleware/ratelimit');
app.use(rateLimit);

mongoose
  .connect(
    process.env.DB_LINK,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
