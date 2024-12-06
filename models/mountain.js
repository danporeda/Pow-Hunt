const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200')
});

const MountainSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: String,
  vertical: String,
  pass: {
    type: [String],
  },
  acreage: String,
  elevation: String,
  snowfall: String,
  images: [ImageSchema],
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