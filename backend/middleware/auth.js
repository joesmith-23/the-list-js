const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/UserModel');

module.exports = catchAsync(async function(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt && req.cookies.jwt !== '') {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You need to be logged in', 401));
  }

  // 2. Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists - i.e. hasn't been deleted before the token expires
  const currentUser = await User.findById(mongoose.Types.ObjectId(decoded.id));
  if (!currentUser) {
    return next(new AppError('This user no longer exists', 401));
  }

  // // 4. Check if user changed password after the token was issued TODO - add this back in when we implement 'passwordChangedAt'
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('Password recently changed, please log in again', 401)
  //   );
  // }

  // Grant access to protected route and puts the current user data on the request object
  req.user = currentUser;
  next();
});
