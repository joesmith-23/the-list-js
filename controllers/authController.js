const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.register = catchAsync(async (req, res, next) => {
  // Pulling out data from the request body
  const { firstName, lastName, email, password } = req.body;
  let user = await User.findOne({ email });

  // If user exists throw an error
  if (user) {
    return next(new AppError('User already exists', 404));
  }

  // Create new user object
  user = new User({
    firstName,
    lastName,
    email,
    password
  });

  // Password encrypting
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // Save new user object with encrypted password
  await user.save();

  // JWT
  // The payload is the data that is being sent
  // This one confirms that the user is logged in and can access private areas
  const payload = {
    user: {
      id: user.id
    }
  };

  jwt.sign(
    payload,
    config.get('jwtSecret'),
    // { expiresIn: 360000 }, // Optional - add back at a reasonable amount when deploying
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});

exports.login = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) return next(new AppError('Email or password is incorrect', 404));

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return next(new AppError('Email or password is incorrect', 404));

  const payload = {
    user: {
      id: user.id
    }
  };

  jwt.sign(
    payload,
    config.get('jwtSecret'),
    // { expiresIn: 360000 },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    }
  );
});
