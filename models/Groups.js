const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
  },
  name: {
    type: String,
    required: true
  },
  members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Group = mongoose.model('group', GroupSchema);