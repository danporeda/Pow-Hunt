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
  price: String,
  vertical: String,
  pass: {
    type: [String],
  },
  acreage: String,
  elevation: String,
  snowfall: String,
});

module.exports = mongoose.model('Mountain', MountainSchema);