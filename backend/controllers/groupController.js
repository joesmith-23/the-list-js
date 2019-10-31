const Group = require('../models/GroupModel');
const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createGroup = catchAsync(async (req, res, next) => {
  const group = new Group({
    owner: req.user.id,
    name: req.body.name
  });

  group.members.unshift(req.user.id);

  await group.save();

  res.status(200).json({
    status: 'success',
    data: {
      group
    }
  });
});

exports.getAllGroups = catchAsync(async (req, res, next) => {
  const groups = await Group.find();

  res.status(200).json({
    status: 'success',
    results: groups.length,
    data: {
      groups
    }
  });
});

exports.getGroupsUserOwnerOf = catchAsync(async (req, res, next) => {
  const groups = await Group.find({
    owner: req.user.id
  });

  if (groups.length < 1)
    return next(new AppError("You don't have any groups, make one now", 404));

  res.status(200).json({
    status: 'success',
    results: groups.length,
    data: {
      groups
    }
  });
});

exports.getGroupsUserMemberOf = catchAsync(async (req, res, next) => {
  const groups = await Group.find({
    'members._id': req.user.id
  });

  if (groups.length < 1)
    return next(new AppError("You don't have any groups, make one now", 404));

  res.status(200).json({
    status: 'success',
    results: groups.length,
    data: {
      groups
    }
  });
});

exports.getGroup = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      group: req.group
    }
  });
});

exports.addUserToGroupWithEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Check to see if the desired user exists
  const user = await User.findOne({ email });

  // If user doesn't exist - show error for now - TODO - send email to ask user to sign up
  if (!user) return next(new AppError('No user found', 404));

  // If user already in group, don't add them again
  const userCheck = req.group.members.find(member => member.id === user.id);
  if (userCheck) next(new AppError('User already member of group', 400));

  req.group.members.unshift(user);

  req.group.save();

  res.status(200).json({
    status: 'success',
    data: {
      group: req.group
    }
  });
});

exports.getGroupMembers = catchAsync(async (req, res, next) => {
  const { members } = req.group;

  if (members.length < 1)
    return next(
      new AppError('There are no members of this group, somehow...', 404)
    );

  const membersArray = [];
  members.forEach(el =>
    membersArray.push(User.findById(el._id).select('firstName lastName'))
  );

  const populatedMembers = await Promise.all(membersArray);

  res.status(200).json({
    status: 'success',
    results: populatedMembers.length,
    data: {
      members: populatedMembers
    }
  });
});

exports.removeMember = catchAsync(async (req, res, next) => {
  // Only the owner can remove a member
  // eslint-disable-next-line eqeqeq
  if (req.group.owner == req.user.id) {
    const member = req.group.members.find(el => el.id === req.params.member_id);

    // Make sure member exists
    if (!member) next(new AppError('Member is not part of group', 400));
    // Make sure owner isn't deleting themselves
    // eslint-disable-next-line eqeqeq
    if (member.id == req.user.id)
      next(new AppError('You cannot delete yourself', 400));

    // Get remove index
    const removeIndex = req.group.members
      .map(el => el.id)
      .indexOf(req.params.member_id);

    req.group.members.splice(removeIndex, 1);

    await req.group.save();

    res.status(200).json({
      status: 'success',
      data: {
        group: req.group
      }
    });
  }
});

exports.deleteGroup = catchAsync(async (req, res, next) => {
  await Group.findOneAndRemove({ _id: req.params.group_id });

  res.status(200).json({
    status: 'success'
  });
});
