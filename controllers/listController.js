const { validationResult } = require('express-validator');

const Group = require('../models/GroupModel');
const User = require('../models/UserModel');
const List = require('../models/ListModel');
const auth = require('../middleware/auth');

exports.addList = async (req, res) => {
  // TODO - Add group existing check

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name } = req.body;

    const newList = new List({
      group: req.group,
      name
    });

    const list = await newList.save();

    res.json(list);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllListsWithinGroup = async (req, res) => {
  try {
    // Find group
    const { group } = req;

    const lists = await List.find({ group });

    res.json(lists);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Lists not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.deleteList = async (req, res) => {
  // TODO probably some edge cases to do here
  try {
    // Find list
    const list = await List.findById(req.params.list_id);

    // If list doesn't exist, throw error
    if (!list) {
      return res.status(400).json({ errors: [{ msg: 'List not found' }] });
    }

    await List.findOneAndRemove({ _id: req.params.list_id });

    res.json({ msg: 'List deleted' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Lists not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.addItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Find list
    const list = await List.findById(req.params.list_id);

    const newItem = {
      name: req.body.name
    };

    list.items.unshift(newItem);

    await list.save();

    res.json(list);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteItem = async (req, res) => {
  try {
    // Find list
    const list = await List.findById(req.params.list_id);

    // Pull out item
    const item = list.items.find(el => el.id === req.params.item_id);

    // Make sure item exists
    if (!item) {
      return res.status(404).json({ msg: 'That does not exist' });
    }

    // Get remove index
    const removeIndex = list.items.map(el => el.id).indexOf(req.params.item_id);

    list.items.splice(removeIndex, 1);

    await list.save();

    // Do I need to return something?
    res.json(list.items);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.addRating = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Finds user as each rating has a user id associated with it
    const user = await User.findById(req.user.id).select('-password');

    // Find list
    const list = await List.findById(req.params.list_id);
    // Find item
    const item = list.items.find(el => el.id === req.params.item_id);

    // Get rating value from req.body
    const { value } = req.body;

    if (value < 0 || value > 10) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'A rating is required between 0 and 10' }] });
    }

    // Check if the item has already been rated
    if (
      item.rating.filter(rating => rating.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: 'You can only rate it once' });
    }

    // Do we need to send all the user object?!?!?!?!  or just the id
    const rating = {
      user,
      value
    };

    item.rating.unshift(rating);

    await list.save();

    res.json(item.rating);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    // Find group
    const group = await Group.findById(req.params.id);

    // Check to see if currently logged in user is part of group - stops random people viewing the groups members
    const currentUser = req.user.id;
    const currentUserCheck = group.members.find(
      member => member.id === currentUser
    );
    if (!currentUserCheck) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'You are not part of this group' }] });
    }

    // Find list
    const list = await List.findById(req.params.list_id);
    // Find item
    const item = list.items.find(item => item.id === req.params.item_id);
    // Get ratings
    // const ratings = item.find( {rating} );

    // const averageRating = await List.aggregate( [
    //   { $match: items.rating }
    //   ]
    // );

    // console.log(list.items)

    // LEARN ABOUT MONGODB AND MONGODB AGGREGATION

    res.json(lists);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Lists not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.removeRating = async (req, res) => {
  try {
    // Find list
    const list = await List.findById(req.params.list_id);
    // Find item
    const item = list.items.find(el => el.id === req.params.item_id);
    // Find rating
    const rating = item.rating.find(el => el.id === req.params.rating_id);

    if (!rating) {
      return res.status(404).json({ msg: 'Rating does not exist' });
    }

    await rating.remove();
    await list.save();

    res.json(list.items);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
