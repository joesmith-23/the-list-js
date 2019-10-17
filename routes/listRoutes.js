const express = require('express');
// const { check } = require('express-validator');

const auth = require('../middleware/auth');
const partOfGroup = require('../middleware/partOfGroup');
const listController = require('../controllers/listController');

const router = express.Router();

router
  .route('/:group_id')
  .post(auth, partOfGroup, listController.addList)
  .get(auth, partOfGroup, listController.getAllListsWithinGroup);

router.delete(
  '/:group_id/:list_id',
  auth,
  partOfGroup,
  listController.deleteList
);

router.post(
  '/items/:group_id/:list_id',
  auth,
  partOfGroup,
  listController.addItem
);

router.delete(
  '/items/:group_id/:list_id/:item_id',
  auth,
  partOfGroup,
  listController.deleteItem
);

router.post(
  '/items/ratings/:group_id/:list_id/:item_id',
  auth,
  partOfGroup,
  listController.addRating
);

router.get(
  '/ratings/:group_id/:list_id/:item_id/',
  auth,
  listController.getAverageRating
);

router
  .route('/items/ratings/:group_id/:list_id/:item_id/:rating_id')
  .delete(auth, partOfGroup, listController.removeRating)
  .patch(auth, partOfGroup, listController.updateRating);

module.exports = router;
