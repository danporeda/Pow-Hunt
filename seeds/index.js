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
    pass: ['RCR', 'epic', 'super pass'],
    image: 'https://kickinghorseresort.com/wp-content/uploads/2016/09/best-140120-1974.jpg'
  },
  {
    name: 'Revelstoke',
    location: 'Revelstoke, BC',
    price: '(CAD) $179',
    vertical: '5,620',
    acreage: '3,121',
    elevation: '7,677',
    snowfall: '413',
    pass: ['ikon', 'mountain collective'],
    image: 'https://www.revelstokemountainresort.com/site/assets/files/2937/zl_20220103-204.800x672.webp'
  },
  {
    name: 'Lake Louise',
    location: 'Lake Louise, AB',
    price: '(CAD) $125',
    vertical: '3,250',
    acreage: '4,200',
    elevation: '8,650',
    snowfall: '211',
    pass: ['SkiBig3', 'ikon', 'rocky mountain passport', 'mountain collective'],
    image: 'https://www.skilouise.com/wp-content/uploads/2024/10/about-1.webp'
  },
  {
    name: 'Sunshine Village',
    location: 'Banff, AB',
    price: '(CAD) $90',
    vertical: '3,514',
    acreage: '3,300',
    elevation: '8,954',
    snowfall: '360',
    pass: ['SkiBig3', 'ikon', 'mountain collective'],
    image: 'https://www.skibanff.com/application/files/8216/1592/1661/InDesign_-_Blog_Photo_Templates_vilage.jpg'
  },
  {
    name: 'Panorama',
    location: 'Panorama, BC',
    price: '(CAD) $75 - $117',
    vertical: '4,265',
    acreage: '2,975',
    elevation: '8,038',
    snowfall: '204',
    pass: ['ikon', 'mountain collective'],
    image: 'https://www.panoramaresort.com/assets/Uploads/AVoykin_PanoramaWEB_2021-22.jpg'
  },
  {
    name: 'Big Sky',
    location: 'Big Sky, MT',
    price: '$56 - $270',
    vertical: '4,350',
    acreage: '5,850',
    elevation: '11,166',
    snowfall: '400',
    pass: ['ikon'],
    image: 'https://cdn.sanity.io/images/8ts88bij/big-sky/3961df6084cdbe4775265adfda4b9a7ee4f8d26b-2100x1399.jpg?w=1920&auto=format'
  },
  {
    name: 'Schweitzer',
    location: 'Sandpoint, ID',
    price: '125',
    vertical: '2,400',
    pass: [ 'ikon' ],
    acreage: '2,900',
    elevation: '6,400',
    snowfall: '302',
    image: 'https://d3mqmy22owj503.cloudfront.net/15/500315/images/site_graphics/Schweitzer-Mountain-Resort-Snow-Ghost.png'
  },
  {
    name: 'Whitefish',
    location: 'Whitefish, MT',
    price: '97',
    vertical: '2,353',
    pass: [],
    acreage: '3000',
    elevation: '6,817',
    snowfall: '301',
    image: 'https://skiwhitefish.com/wp-content/uploads/2023/10/PassSale.jpg'
  }
];

const seedDB = async () => {
  await Mountain.deleteMany({});
  await Mountain.insertMany(mountainList);
}
seedDB().then(() => {
  mongoose.connection.close();
});
