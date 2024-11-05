const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { mountainSchema } = require('./schemas.js'); 
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Mountain = require('./models/mountain');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/pow-hunt');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateMountain = (req, res, next) => {
  const { error } = mountainSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/mountains', catchAsync(async (req, res) => {
  const mountains = await Mountain.find({});
  res.render('mountains/index', { mountains });
}))

app.get('/mountains/new', (req, res) => {
  res.render('mountains/new');
})

app.post('/mountains', validateMountain, catchAsync(async (req, res, next) => {    
    const newMountain = new Mountain(req.body.mountain);
    await newMountain.save();
    res.redirect('/mountains');
}))

app.get('/mountains/:id', catchAsync(async (req, res) => {
  const mountain = await Mountain.findById(req.params.id);
  res.render('mountains/show', { mountain });
}))

app.get('/mountains/:id/edit', catchAsync(async (req, res) => {
  const mountain = await Mountain.findById(req.params.id);
  res.render('mountains/edit', { mountain });
}))

app.put('/mountains/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Mountain.findByIdAndUpdate(id, { ...req.body.mountain });
  res.redirect(`/mountains/${id}`);
}))

app.delete('/mountains/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const mountain = await Mountain.findByIdAndDelete(id);
  console.log(id);
  res.redirect('/mountains');
  console.log(`${mountain.name} has been deleted`)
}))

app.post('/mountains/:id/reviews', catchAsync(async (req, res) => {
  const mountain = await Mountain.findById(req.params.id);
  const review = new Review(req.body.review);
  await review.save();
  mountain.reviews.push(review);
  await mountain.save();
  res.redirect(`/mountains/${mountain._id}`);
}))

app.all('*', (req, res, next) => {
  next(new ExpressError('Page notttt found', 404));
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh no, sum ting went wong';
  res.status(statusCode).render('error', { err });
  console.log({...err});
})

app.listen(3000, () => {
  console.log('Serving on Port 3000')
});
