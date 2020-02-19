const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Please name your group']
  },
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

// QUERY MIDDLEWEAR

// GroupSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'members.user'
//   });
//   next();
// });

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
