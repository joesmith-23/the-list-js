const jwt = require('jsonwebtoken');
const { promisify } = require('util');
// const config = require('config');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/UserModel');

module.exports = catchAsync(async function(req, res, next) {
  // // Get token from header
  // const token = req.header('x-auth-token');

  // // Check if no token
  // if (!token) return next(new AppError('No authorization token', 404));

  // // Verify token
  // try {
  //   const decoded = jwt.verify(token, config.get('jwtSecret'));

  //   req.user = decoded.user; // The decoded.user comes from the Payload object that has a user
  //   next();
  // } catch (err) {
  //   return next(new AppError('Authorisation token not valid', 404));
  // }
  // 1. Check to see if user logged in (token exists)
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You need to be logged in', 401));
  }

  // 2. Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists - i.e. hasn't been deleted before the token expires
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('This user no longer exists', 401));
  }

  // // 4. Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('Password recently changed, please log in again', 401)
  //   );
  // }

  // Grant access to protected route and puts the current user data on the request object
  req.user = currentUser;
  next();
});
