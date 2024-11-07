express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Mountain = require('../models/mountain');
const { mountainSchema } = require('../schemas.js'); 

const validateMountain = (req, res, next) => {
  const { error } = mountainSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

router.get('/', catchAsync(async (req, res) => {
  const mountains = await Mountain.find({});
  res.render('mountains/index', { mountains });
}))

router.get('/new', (req, res) => {
  res.render('mountains/new');
})

router.post('/', validateMountain, catchAsync(async (req, res, next) => {
  const { mountain } = req.body;
  if (!mountain.image) {
    mountain.image = 'https://images.megapixl.com/725/7253122.jpg'
  }
  const newMountain = new Mountain(mountain);
  await newMountain.save();
  res.redirect('/mountains');
}))

router.get('/:id', catchAsync(async (req, res) => {
  const mountain = await Mountain.findById(req.params.id).populate('reviews');
  res.render('mountains/show', { mountain });
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
  const mountain = await Mountain.findById(req.params.id);
  res.render('mountains/edit', { mountain });
}))

router.put('/:id', catchAsync(async (req, res) => {
  const { mountain } = req.body;
  if (!mountain.image) {
    mountain.image = 'https://images.megapixl.com/725/7253122.jpg'
  }
  const { id } = req.params;
  await Mountain.findByIdAndUpdate(id, { ...mountain });
  res.redirect(`/mountains/${id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const mountain = await Mountain.findByIdAndDelete(id);
  console.log(id);
  res.redirect('/mountains');
  console.log(`${mountain.name} has been deleted`)
}))

module.exports = router;