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

const opts = { toJSON: { virtuals: true } };

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
  price: {
    cost: {
      type: Number
    },
    curr: {
      type: String,
      enum: ['USD', 'CAD', 'EURO']
    }
  },
  vertical: Number,
  pass: {
    type: [String],
  },
  acreage: Number,
  elevation: Number,
  snowfall: Number,
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
}, opts);

MountainSchema.virtual('properties.popUpMarkup').get(function() {
  return `<strong><a href="/mountains/${this._id}">${this.name}</a></strong>
  <p>${this.location}</p>`;
})

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