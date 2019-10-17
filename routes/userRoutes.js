const express = require('express');
// const { check } = require('express-validator');

const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/')
  .post(authController.register)
  .get(auth, userController.getAllUsers);

router
  .route('/:id')
  .patch(auth, userController.updateUser)
  .delete(auth, userController.deleteUser);

router.get('/me', auth, userController.getUser);

router.post(
  '/login',
  // [
  //   check('email', 'Please include a valid email').isEmail(),
  //   check('password', 'Password is required').exists()
  // ],
  authController.login
);
router.get('/logout', authController.logout);

module.exports = router;
