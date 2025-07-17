const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/score");

const userSchema = new mongoose.Schema({
  name: String,
  profile: String,
  totalPoints: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);
