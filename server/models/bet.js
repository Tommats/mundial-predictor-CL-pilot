var mongoose = require('mongoose');

var Bet = mongoose.model('Bet', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed : {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Bet};
