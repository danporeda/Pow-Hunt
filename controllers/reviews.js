const Mountain = require('../models/mountain');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  const mountain = await Mountain.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  await review.save();
  mountain.reviews.push(review);
  await mountain.save();
  req.flash('success', 'Created new review!')
  res.redirect(`/mountains/${mountain._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Mountain.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash('success', 'Successfully deleted review');
  res.redirect(`/mountains/${id}`);
};