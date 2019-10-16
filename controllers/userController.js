const User = require('../models/UserModel');

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
};

exports.updateUser = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    res.json({ msg: 'No user with that id' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    res.json({ msg: 'No user with that id' });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
};
