const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  name: {
    type: String,
    required: [true, 'You must enter a name for your list']
  },
  items: [
    {
      name: {
        type: String,
        required: [true, 'You must enter a name']
      },
      rating: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
          value: {
            type: Number,
            required: [true, 'Please enter a value for the rating'],
            min: 1,
            max: 10
          }
        }
      ],
      averageRating: {
        type: Number
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const List = mongoose.model('List', ListSchema);
module.exports = List;
