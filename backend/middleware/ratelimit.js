const setRateLimit = require('express-rate-limit');

const rateLimit = setRateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'You have exceeded your 5 requests per minute limit.',
  headers: true,
});

module.exports = rateLimit;