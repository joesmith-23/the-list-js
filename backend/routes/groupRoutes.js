const express = require('express');

const auth = require('../middleware/auth');
const groupController = require('../controllers/groupController');
const partOfGroup = require('../middleware/partOfGroup');

const router = express.Router();

router
  .route('/')
  .get(auth, groupController.getAllGroups)
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
  .post(auth, partOfGroup, groupController.addUserToGroupWithEmail);
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
router.delete(
  '/:group_id/:member_id/remove-self',
  auth,
  partOfGroup,
  groupController.leaveGroup
);

module.exports = router;
