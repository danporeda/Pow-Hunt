const mongoose = require('mongoose');
const Mountain = require('../models/mountain');

mongoose.connect('mongodb://localhost:27017/pow-hunt');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database connected");
});

const mountainList = [
  {
    name: 'Kicking Horse',
    location: 'Golden, BC',
    price: '(CAD) $149 - $189',
    vertical: '4,314',
    acreage: '3,400',
    elevation: '8,218',
    snowfall: '288',
    pass: ['RCR', 'epic', 'super pass'] 
  },
  {
    name: 'Revelstoke',
    location: 'Revelstoke, BC',
    price: '(CAD) $179',
    vertical: '5,620',
    acreage: '3,121',
    elevation: '7,677',
    snowfall: '413',
    pass: ['ikon', 'mountain collective'] 
  },
  {
    name: 'Lake Louise',
    location: 'Lake Louise, AB',
    price: '(CAD) $125',
    vertical: '3,250',
    acreage: '4,200',
    elevation: '8,650',
    snowfall: '211',
    pass: ['SkiBig3', 'ikon', 'rocky mountain passport', 'mountain collective'] 
  },
  {
    name: 'Sunshine Village',
    location: 'Banff, AB',
    price: '(CAD) $90',
    vertical: '3,514',
    acreage: '3,300',
    elevation: '8,954',
    snowfall: '360',
    pass: ['SkiBig3', 'ikon', 'mountain collective'] 
  },
  {
    name: 'Panorama',
    location: 'Panorama, BC',
    price: '(CAD) $75 - $117',
    vertical: '4,265',
    acreage: '2,975',
    elevation: '8,038',
    snowfall: '204',
    pass: ['ikon', 'mountain collective'] 
  },
  {
    name: 'Big Sky',
    location: 'Big Sky, MT',
    price: '$56 - $270',
    vertical: '4,350',
    acreage: '5,850',
    elevation: '11,166',
    snowfall: '400',
    pass: ['ikon'] 
  }
];

const seedDB = async () => {
  await Mountain.deleteMany({});
  await Mountain.insertMany(mountainList);
}
seedDB().then(() => {
  mongoose.connection.close();
});