var mongoose = require('mongoose');

var Prediction = mongoose.model('Prediction', {
  matchId: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  home: {
    type: Number,
    default: 0
  },
  away: {
    type: Number,
    default: 0
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

module.exports = {Prediction};
