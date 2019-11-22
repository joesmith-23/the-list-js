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
            min: [1, 'Rating must be between 1 and 10'],
            max: [10, 'Rating must be between 1 and 10']
          }
        }
      ],
      averageRating: {
        type: Number,
        default: 5
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

// ListSchema.statics.calcAverageRatings = async function(itemId) {
//   const stats = await this.aggregate([
//     {
//       $match: {
//         items: itemId
//       },
//       $group: {
//         _id: '$items',
//         numRatings: { $sum: 1 },
//         avgRating: { $avg: 'rating.value' }
//       }
//     }
//   ]);
//   console.log(stats);
// };

// ListSchema.post('save', function(next) {
//   this.constructor.calcAverageRatings(this.items.rating);
//   next();
// });

const List = mongoose.model('List', ListSchema);
module.exports = List;
