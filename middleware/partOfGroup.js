const Group = require('../models/GroupModel');

const partOfGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.group_id);
    if (!group) {
      res.status(404).json({
        errors: [{ msg: 'Group does not exist' }]
      });
    }
    const currentUserCheck = group.members.find(
      member => member.id === req.user.id
    );
    if (!currentUserCheck) {
      res.status(400).json({
        errors: [{ msg: 'You are not part of this group' }]
      });
    } else {
      req.group = group;
      next();
    }
  } catch (error) {
    console.log(error.response.message);
  }
};

module.exports = partOfGroup;
