const express = require('express');
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/')
  .post(
    [
      check('firstName', 'A first name is required')
        .not()
        .isEmpty(),
      check('lastName', 'A last name is required')
        .not()
        .isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check(
        'password',
        'Please enter a password with 6 or more characters'
      ).isLength({ min: 6 })
    ],
    authController.register
  )
  .get(auth, userController.getAllUsers);

router
  .route('/:id')
  .patch(auth, userController.updateUser)
  .delete(auth, userController.deleteUser);

router.get('/me', auth, userController.getUser);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

module.exports = router;
