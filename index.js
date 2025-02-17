if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const User = require('./models/user');
const helmet = require('helmet');
const MongoStore = require("connect-mongo");
const userRoutes = require('./routes/user');
const mountainRoutes = require('./routes/mountains');
const reviewRoutes = require('./routes/reviews');

const dbUrl = process.env.DB_URL;

// 'mongodb://localhost:27017/pow-hunt'  local mongoDB
mongoose.connect(dbUrl);
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
  replaceWith: '_',
}));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: 'thisisthesecret'
  }
});

store.on("error", function(e){
  console.log("Session store error: ", e);
})

const sessionConfig = { 
  store: store,
  name: 'session',
  secret: 'thisisthesecret', 
  resave: false, 
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  } 
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", 
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
  "https://api.maptiler.com/", 
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dk5s5hoqv/",
        "https://images.unsplash.com",
        "https://api.maptiler.com/",
        "*.revelstokemountainresort.com/site/assets/files/2937/",
        "https://www.skilouise.com/",
        "https://images.megapixl.com/",
        "https://d3mqmy22owj503.cloudfront.net/15/500315/images/",
        "https://kickinghorseresort.com/wp-content/"
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  if (req.method === 'GET' && req.originalUrl !== '/login') {
    req.session.returnTo = req.originalUrl;
  }
  console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/', userRoutes);
app.use('/mountains', mountainRoutes);
app.use('/mountains/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
  res.render('home');
});


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
