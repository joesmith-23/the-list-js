const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.register = catchAsync(async (req, res, next) => {
  // Pulling out data from the request body
  const { firstName, lastName, email, password, passwordConfirm } = req.body;
  const user = await User.findOne({ email });

  // If user exists throw an error
  if (user) {
    return next(new AppError('User already exists', 404));
  }

  // Create new user object
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    passwordConfirm
  });

  // Save new user object with encrypted password
  await newUser.save();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new AppError('Email or password is incorrect', 404));

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return next(new AppError('Email or password is incorrect', 404));

  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    status: 'success',
    token: null,
    data: {
      data: null
    }
  });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array e.g. ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission', 403));
    }
    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1. Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  const { passwordCurrent } = req.body;

  // 2. Check if POSTed password is correct
  const isMatch = await bcrypt.compare(passwordCurrent, user.password);

  if (!isMatch) {
    return next(new AppError('The password is incorrect', 401));
  }

  // 3. If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // The above is then passed through the userModel middlewear to encrypt the password
  // TODO - add 'passwordChangedAt'
  await user.save();

  // 4. Log user in, send JWT
  createSendToken(user, 200, res);
});
