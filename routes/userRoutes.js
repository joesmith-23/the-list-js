const express = require('express');
// const { check } = require('express-validator');

const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.patch('/updateMyPassword', auth, authController.updatePassword);

router
  .route('/')
  .post(authController.register)
  .get(auth, authController.restrictTo('admin'), userController.getAllUsers);

router.patch('/updateMe', auth, userController.updateMe);
router.get('/me', auth, userController.getUser);

router
  .route('/:id')
  .patch(auth, authController.restrictTo('admin'), userController.updateUser)
  .delete(auth, authController.restrictTo('admin'), userController.deleteUser);

router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
