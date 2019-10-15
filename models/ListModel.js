const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  name: {
    type: String,
    required: true
  },
  items: [
    {
      name: {
        type: String,
        required: true
      },
      rating: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
          value: {
            type: Number,
            required: true
          }
        }
      ],
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

const List = mongoose.model('List', ListSchema);
module.exports = List;
