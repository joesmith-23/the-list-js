const express = require('express');
const { check } = require('express-validator');

const auth = require('../middleware/auth');
const groupController = require('../controllers/groupController');
const partOfGroup = require('../middleware/partOfGroup');

const router = express.Router();

router
  .route('/')
  .get(groupController.getAllGroups)
  .post(auth, groupController.createGroup);

router.get('/all-user-groups', auth, groupController.getGroupsUserMemberOf);
router.get(
  '/all-user-groups-owned',
  auth,
  groupController.getGroupsUserOwnerOf
);

router
  .route('/:group_id')
  .get(auth, partOfGroup, groupController.getGroup)
  .post(
    [[check('email', 'You must enter an email address').isEmail()], auth],
    partOfGroup,
    groupController.addUserToGroupWithEmail
  );
router.get(
  '/:group_id/members',
  auth,
  partOfGroup,
  groupController.getGroupMembers
);
router.delete(
  '/:group_id/:member_id',
  auth,
  partOfGroup,
  groupController.removeMember
);
router.delete('/:group_id', auth, partOfGroup, groupController.deleteGroup);

module.exports = router;
