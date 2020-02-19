const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A first name is required']
  },
  lastName: {
    type: String,
    required: [true, 'A last name is required']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!! ( .create() and .save() ) not on update
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords do not match'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

UserSchema.pre('save', async function(next) {
  // Only run this function if the password has been modified
  if (!this.isModified('password')) return next();

  // Hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;

// Maybe need to add a list of groups that the user is part of and ratings the user has submitted
