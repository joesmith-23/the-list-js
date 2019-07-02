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
        rating: [
            {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
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
        },
    } 
  ],
  date: {
    type: Date,
    default: Date.now
  },  
});

module.exports = List = mongoose.model('list', ListSchema);