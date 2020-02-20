const mongoose = require('mongoose');

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

  res.status(200).json({
    status: 'success',
    data: {
      list
    }
  });
});

exports.getAllListsWithinGroup = catchAsync(async (req, res, next) => {
  const { group } = req;

  const lists = await List.find({ group });

  res.status(200).json({
    status: 'success',
    data: {
      lists
    }
  });
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

  res.status(200).json({
    status: 'success'
  });
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

  res.status(200).json({
    status: 'success',
    data: {
      list
    }
  });
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
  res.status(200).json({
    status: 'success',
    data: {
      list
    }
  });
});

exports.addRating = catchAsync(async (req, res, next) => {
  // Finds user as each rating has a user id associated with it
  const user = req.user.id;

  // Find list
  const list = await List.findById(req.params.list_id);

  if (!list) return next(new AppError("That list doesn't exist", 400));

  // Find item
  const item = list.items.find(el => el.id === req.params.item_id);

  // Get rating value from req.body
  const { value } = req.body;

  // Number validation
  if (value < 0 || value > 10)
    return next(new AppError('Please enter a number between 1 and 10', 400));

  Math.round(value);

  // Check if the item has already been rated
  if (
    item.rating.filter(rating => rating.user.toString() === req.user.id)
      .length > 0
  ) {
    return next(new AppError('You can only rate it once', 400));
  }

  // Do we need to send all the user object?!?!?!?!  or just the id
  const rating = {
    user,
    value
  };

  item.rating.unshift(rating);

  await list.save();

  const averageRating = await List.aggregate([
    { $unwind: '$items' },
    {
      $match: {
        'items._id': mongoose.Types.ObjectId(`${req.params.item_id}`)
      }
    },
    { $unwind: '$items.rating' },
    {
      $replaceRoot: { newRoot: '$items.rating' }
    },
    {
      $group: {
        _id: '',
        avgRating: { $avg: '$value' }
      }
    }
  ]);

  item.averageRating = averageRating[0].avgRating;

  await list.save();

  res.status(200).json({
    status: 'success',
    data: {
      item
    }
  });
});

exports.getAverageRating = catchAsync(async (req, res, next) => {
  // Find list
  const list = await List.findById(req.params.list_id);
  // Find item
  const item = list.items.find(el => el.id === req.params.item_id);

  res.status(200).json({
    status: 'success',
    data: {
      averageRating: item.averageRating
    }
  });
});

exports.updateRating = catchAsync(async (req, res, next) => {
  // Find list
  const list = await List.findById(req.params.list_id);
  if (!list) {
    return next(new AppError('Could not find that list', 404));
  }
  // Find item
  const item = list.items.find(el => el.id === req.params.item_id);
  if (!item) {
    return next(new AppError('Could not find that item', 404));
  }

  // Find rating
  const rating = item.rating.find(el => el.id === req.params.rating_id);
  if (!rating) {
    return next(new AppError('Rating does not exist', 404));
  }

  if (rating.id !== req.user.id) {
    return next(
      new AppError("You can't update a rating that isn't yours", 404)
    );
  }

  const { newRating } = req.body;

  rating.value = newRating;

  await list.save();

  const averageRating = await List.aggregate([
    { $unwind: '$items' },
    {
      $match: {
        'items._id': mongoose.Types.ObjectId(`${req.params.item_id}`)
      }
    },
    { $unwind: '$items.rating' },
    {
      $replaceRoot: { newRoot: '$items.rating' }
    },
    {
      $group: {
        _id: '',
        avgRating: { $avg: '$value' }
      }
    }
  ]);

  item.averageRating = averageRating[0].avgRating;

  await list.save();

  res.status(200).json({
    status: 'success',
    data: {
      item
    }
  });
});

exports.removeRating = catchAsync(async (req, res, next) => {
  // Find list
  const list = await List.findById(req.params.list_id);
  if (!list) {
    return next(new AppError('Could not find that list', 404));
  }
  // Find item
  const item = list.items.find(el => el.id === req.params.item_id);
  if (!item) {
    return next(new AppError('Could not find that item', 404));
  }
  // Find rating
  const rating = item.rating.find(el => el.id === req.params.rating_id);

  if (!rating) return next(new AppError('Rating does not exist', 404));

  if (rating.id !== req.user.id) {
    return next(
      new AppError("You can't remove a rating that isn't yours", 404)
    );
  }

  await rating.remove();

  if (item.rating < 1) {
    // TODO - maybe make this 0 - need to go over it and how it interacts with add/update rating
    item.averageRating = null;
  } else {
    const averageRating = await List.aggregate([
      { $unwind: '$items' },
      {
        $match: {
          'items._id': mongoose.Types.ObjectId(`${req.params.item_id}`)
        }
      },
      { $unwind: '$items.rating' },
      {
        $replaceRoot: { newRoot: '$items.rating' }
      },
      {
        $group: {
          _id: '',
          avgRating: { $avg: '$value' }
        }
      }
    ]);

    item.averageRating = averageRating[0].avgRating;
  }

  await list.save();

  res.status(200).json({
    status: 'success',
    data: {
      item
    }
  });
});
