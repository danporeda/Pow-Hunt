const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MountainSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: Number,
  vertical: Number,
  pass: {
    type: String,
  },
  acreage: Number,
  lifts: Number,
  snowfall: Number,
});

module.exports = mongoose.model('Mountain', MountainSchema);