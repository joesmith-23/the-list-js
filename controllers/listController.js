const List = require('../models/ListModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.addList = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const newList = new List({
    group: req.group,
    name
  });

  const list = await newList.save();

  res.json(list);
});

exports.getAllListsWithinGroup = catchAsync(async (req, res, next) => {
  const { group } = req;

  const lists = await List.find({ group });

  res.json(lists);
});

exports.deleteList = catchAsync(async (req, res, next) => {
  // TODO probably some edge cases to do here

  // Find list
  const list = await List.findById(req.params.list_id);

  // If list doesn't exist, throw error
  if (!list) {
    return next(new AppError('List not found', 404));
  }

  await List.findOneAndRemove({ _id: req.params.list_id });

  res.json({ msg: 'List deleted' });
});

exports.addItem = catchAsync(async (req, res, next) => {
  // TODO - duplicate check?
  // Find list
  const list = await List.findById(req.params.list_id);

  if (!list) {
    return next(new AppError('List not found', 404));
  }

  const newItem = {
    name: req.body.name
  };

  list.items.unshift(newItem);

  await list.save();

  res.json(list);
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  // Find list
  const list = await List.findById(req.params.list_id);

  if (!list) {
    return next(new AppError('List not found', 404));
  }

  // Pull out item
  const item = list.items.find(el => el.id === req.params.item_id);

  // Make sure item exists
  if (!item) {
    return next(new AppError('List item not found', 404));
  }

  // Get remove index
  const removeIndex = list.items.map(el => el.id).indexOf(req.params.item_id);

  list.items.splice(removeIndex, 1);

  await list.save();

  // Do I need to return something?
  res.json(list.items);
});

exports.addRating = catchAsync(async (req, res, next) => {
  // Finds user as each rating has a user id associated with it
  const user = req.user.id;

  // Find list
  const list = await List.findById(req.params.list_id);
  // Find item
  const item = list.items.find(el => el.id === req.params.item_id);

  // Get rating value from req.body
  const { value } = req.body;

  // Number validation - TODO - make sure only whole digits can be added
  if (value < 0 || value > 10)
    return next(new AppError('Please enter a number between 1 and 10', 400));

  // Check if the item has already been rated
  if (
    item.rating.filter(rating => rating.user.toString() === req.user.id)
      .length > 0
  ) {
    return next(new AppError('You can only rate it once', 404));
  }

  // Do we need to send all the user object?!?!?!?!  or just the id
  const rating = {
    user,
    value
  };

  item.rating.unshift(rating);

  await list.save();

  res.json(item.rating);
});

exports.getAverageRating = catchAsync(async (req, res, next) => {
  // // Find list
  // const list = await List.findById(req.params.list_id);
  // // Find item
  // const item = list.items.find(item => item.id === req.params.item_id);
  // // Get ratings
  // // const ratings = item.find( {rating} );
  // // const averageRating = await List.aggregate( [
  // //   { $match: items.rating }
  // //   ]
  // // );
  // console.log(list.items)
  // LEARN ABOUT MONGODB AND MONGODB AGGREGATION
  // res.json(lists);
});

exports.removeRating = catchAsync(async (req, res, next) => {
  // TODO - refactor this to make just a single request
  // Find list
  const list = await List.findById(req.params.list_id);
  // Find item
  const item = list.items.find(el => el.id === req.params.item_id);
  // Find rating
  const rating = item.rating.find(el => el.id === req.params.rating_id);

  if (!rating) return next(new AppError('Rating does not exist', 404));

  await rating.remove();
  await list.save();

  res.json(list.items);
});
