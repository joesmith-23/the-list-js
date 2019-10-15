const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Group = require('../models/GroupModel');
const User = require('../models/UserModel');

exports.createGroup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const group = new Group({
      owner: req.user.id,
      name: req.body.name
    });

    group.members.unshift(req.user.id);

    await group.save();

    res.json(group);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const group = await Group.find();

    if (!group) return res.status(400).json({ msg: 'Groups not found' });

    res.json(group);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Groups not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.getGroupsUserOwnerOf = async (req, res) => {
  try {
    const group = await Group.find({
      owner: req.user.id
    });

    if (!group) return res.status(400).json({ msg: 'Groups not found' });

    res.json(group);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Groups not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.getGroupsUserMemberOf = async (req, res) => {
  try {
    const group = await Group.find({
      'members._id': req.user.id
    });

    if (!group) return res.status(400).json({ msg: 'Groups not found' });

    res.json(group);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Groups not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.getGroup = async (req, res) => {
  try {
    res.json(req.group);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Group not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.addUserToGroupWithEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // Check to see if the user exists
    const user = await User.findOne({ email });

    // If user doesn't exist - show error for now - TODO - send email to ask user to sign up
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Cannot find user' }] });
    }

    // If user already in group, don't add them again
    const userCheck = req.group.members.find(member => member.id === user.id);
    if (userCheck) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User already member of group' }] });
    }

    req.group.members.unshift(user);

    req.group.save();

    res.json(req.group);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.getGroupMembers = async (req, res) => {
  try {
    const { members } = req.group;

    const membersArray = [];

    members.forEach(el =>
      membersArray.push(User.findById(el._id).select('firstName lastName'))
    );

    const populatedMembers = await Promise.all(membersArray);

    res.json(populatedMembers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.removeMember = async (req, res) => {
  // TODO - add functionality to stop normal members removing the owner and stop the owner deleting themselves from the members list
  // Right now anyone can remove anyone - need to tighten this up a bit
  try {
    const member = req.group.members.find(el => el.id === req.params.member_id);

    // Make sure member exists
    if (!member) {
      return res.status(404).json({ msg: 'Member is not part of group' });
    }

    // Get remove index
    const removeIndex = req.group.members
      .map(el => el.id)
      .indexOf(req.params.member_id);

    req.group.members.splice(removeIndex, 1);

    await req.group.save();

    res.json({ msg: 'Member removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    await Group.findOneAndRemove({ _id: req.params.group_id });

    res.json({ msg: 'Group deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
