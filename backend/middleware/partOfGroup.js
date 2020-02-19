const Group = require('../models/GroupModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const partOfGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.group_id);
  if (!group) return next(new AppError('Group does not exist', 404));

  const currentUserCheck = group.members.find(member => {
    // console.log(member, req.user.id);
    return member == req.user.id;
  });

  if (!currentUserCheck)
    return next(new AppError('You are not part of this group', 401));

  req.group = group;
  next();
});

module.exports = partOfGroup;
