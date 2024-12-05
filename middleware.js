const { mountainSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Mountain = require('./models/mountain');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // code below moved to index.js middleware
    // req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be logged in.');
    return res.redirect('/login');
  }
  next();
}

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
}

module.exports.validateMountain = (req, res, next) => {
  const { error } = mountainSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const mountain = await Mountain.findById(id);
  if (!mountain.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to edit');
    return res.redirect(`/mountains/${id}`);
  }
  next();
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author || !review.author.equals(req.user._id)) {
    req.flash('error', "You cannot delete another person's review");
    return res.redirect(`/mountains/${id}`);
  };
  next();
}