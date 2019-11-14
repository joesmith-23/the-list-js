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
  })
    .populate('owner', 'firstName lastName')
    .populate('members', 'firstName lastName')
    .sort('-date');

  if (groups.length < 1)
    return next(new AppError("You don't have any groups, make one now", 400));

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
    members: req.user.id
  })
    .populate('owner', 'firstName lastName')
    .populate('members', 'firstName lastName')
    .sort('-date');

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
  const group = await Group.findById(req.group.id)
    .populate('owner', 'firstName lastName')
    .populate('members', 'firstName lastName');

  res.status(200).json({
    status: 'success',
    data: {
      group
    }
  });
});

exports.addUserToGroupWithEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Check to see if the desired user exists
  const user = await User.findOne({ email }).select('-role');

  // If user doesn't exist - show error for now - TODO - send email to ask user to sign up
  if (!user) return next(new AppError('No user found', 404));

  // If user already in group, don't add them again
  // eslint-disable-next-line eqeqeq
  const userCheck = req.group.members.find(member => member == user.id);
  if (userCheck) next(new AppError('User already member of group', 400));

  req.group.members.unshift(user);

  req.group.save();

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.getGroupMembers = catchAsync(async (req, res, next) => {
  // const { members } = req.group;
  const group = await Group.findById(req.group._id).populate(
    'members',
    '-role'
  );

  const { members } = group;

  if (members.length < 1)
    return next(
      new AppError('There are no members of this group, somehow...', 404)
    );

  // const membersArray = [];
  // members.forEach(el =>
  //   membersArray.push(User.findById(el._id).select('firstName lastName'))
  // );

  // const populatedMembers = await Promise.all(membersArray);

  res.status(200).json({
    status: 'success',
    results: members.length,
    data: {
      members: members
    }
  });
});

exports.removeMember = catchAsync(async (req, res, next) => {
  // Only the owner can remove a member
  // eslint-disable-next-line eqeqeq
  if (req.group.owner == req.user.id) {
    // eslint-disable-next-line eqeqeq
    const member = req.group.members.find(el => el == req.params.member_id);
    console.log(member);

    // Make sure member exists
    if (!member) next(new AppError('Member is not part of group', 400));
    // Make sure owner isn't deleting themselves
    // eslint-disable-next-line eqeqeq
    if (member == req.user.id)
      next(new AppError('You cannot delete yourself', 400));

    // Get remove index
    const removeIndex = req.group.members.map(el => el).indexOf(member);

    req.group.members.splice(removeIndex, 1);

    await req.group.save();

    res.status(200).json({
      status: 'success',
      data: {
        group: req.group
      }
    });
  } else {
    next(new AppError('Only the owner of a group can delete members', 401));
  }
});

exports.deleteGroup = catchAsync(async (req, res, next) => {
  // TODO - make sure only the owner of the group can delete the group
  await Group.findOneAndRemove({ _id: req.params.group_id });

  res.status(200).json({
    status: 'success'
  });
});
