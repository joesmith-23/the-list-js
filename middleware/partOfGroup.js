const Group = require('../models/GroupModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const partOfGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.group_id);
  if (!group) next(new AppError('Group does not exist', 404));

  const currentUserCheck = group.members.find(
    member => member.id === req.user.id
  );
  if (!currentUserCheck) {
    next(new AppError('You are not part of this group', 401));
  } else {
    req.group = group;
    next();
  }
});

module.exports = partOfGroup;
