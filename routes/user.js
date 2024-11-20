const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');

const passportAuthenticate = passport.authenticate(
  'local', 
  { failureFlash: true, failureRedirect: '/login' }
);

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);
    req.login(newUser, err => {
      if (err) return next(err);
      req.flash('success', 'Successfully registered. Happy hunting!');
      res.redirect('/mountains');
    })
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
}));

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.post('/login', storeReturnTo, passportAuthenticate, async (req, res) => {
  const redirectUrl = res.locals.returnTo || '/mountains';
  req.flash('success', 'Welcome back!');
  res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Goodbye!');
    res.redirect('/mountains');
  });
});

module.exports = router;