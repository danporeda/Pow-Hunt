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
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/makemountain', async (req, res) => {
  const mountain  = new Mountain({
    name: 'Kicking Horse',
    location: 'Golden, BC',
    price: '(CAD) $149 - $189',
    vertical: '4,314',
    acreage: '3,400',
    elevation: '8,218',
    snowfall: '288',
    pass: ['RCR', 'epic', 'super pass'] 
  });
  await mountain.save();
  res.send(mountain);
})

app.listen(3000, () => {
  console.log('Serving on Port 3000')
});
