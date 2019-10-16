const jwt = require('jsonwebtoken');
const config = require('config');
const AppError = require('../utils/appError');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) return next(new AppError('No authorization token', 404));

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    req.user = decoded.user; // The decoded.user comes from the Payload object that has a user
    next();
  } catch (err) {
    return next(new AppError('Authorisation token not valid', 404));
  }
};
