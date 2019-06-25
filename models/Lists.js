const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'group'
  },
  name: {
      type: String,
      required: true
  },
  items: [
    {
        name:{
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        rating: [
            {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            value: {
                type: mongoose.Schema.Types.Double,
                required: true
            }
            }
        ],
    } 
  ],
});

module.exports = List = mongoose.model('list', ListSchema);