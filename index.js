const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Mountain = require('./models/mountain');

mongoose.connect('mongodb://localhost:27017/pow-hunt');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/mountains', async (req, res) => {
  const mountains = await Mountain.find({});
  res.render('mountains/index', { mountains });
})

app.get('/mountains/new', (req, res) => {
  res.render('mountains/new');
})

app.get('/mountains/:id', async (req, res) => {
  const mountain = await Mountain.findById(req.params.id);
  res.render('mountains/show', { mountain });
})

app.post('/mountains', async (req, res) => {
  console.log(req.body);
})

app.listen(3000, () => {
  console.log('Serving on Port 3000')
});
