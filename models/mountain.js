const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

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
  images: [
    {
    url: String,
    filename: String
    }
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

MountainSchema.post('findOneAndDelete', async function (mountain) {
  if (mountain) {
    await Review.deleteMany({
      _id: {
        $in: mountain.reviews
      }
    })
  }

  // if (mountain.reviews.length) {
  //   const res = await Review.deleteMany({ _id: { $in: mountain.reviews } });
  //   console.log(res);
  // }
})

module.exports = mongoose.model('Mountain', MountainSchema);