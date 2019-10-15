const express = require('express');
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const partOfGroup = require('../middleware/partOfGroup');
const listController = require('../controllers/listController');

const router = express.Router();

router
  .route('/:group_id')
  .post(
    [
      auth,
      [
        check('name', 'You must enter a name for your list')
          .not()
          .isEmpty()
      ]
    ],
    partOfGroup,
    listController.addList
  )
  .get(auth, partOfGroup, listController.getAllListsWithinGroup);

router.delete(
  '/:group_id/:list_id',
  auth,
  partOfGroup,
  listController.deleteList
);

router.post(
  '/items/:group_id/:list_id',
  [
    auth,
    [
      check('name', 'This is required')
        .not()
        .isEmpty()
    ]
  ],
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
  [auth, [check('value', 'A rating is required between 0 and 10').isNumeric()]],
  partOfGroup,
  listController.addRating
);

// TODO - finish this
router.get(
  '/ratings/:group_id/:list_id/:item_id/',
  auth,
  listController.getAverageRating
);

router.delete(
  '/items/ratings/:group_id/:list_id/:item_id/:rating_id',
  auth,
  partOfGroup,
  listController.removeRating
);

module.exports = router;
