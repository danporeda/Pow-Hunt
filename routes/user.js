const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');
const passport = require('passport');

const passportAuthenticate = passport.authenticate(
  'local', 
  { failureFlash: true, failureRedirect: '/login' }
);

router.route('/register')
  .get(users.renderNewUserForm)
  .post(catchAsync(users.createNewUser));

router.route('/login')
.get(users.renderLoginForm)
.post(storeReturnTo, passportAuthenticate, users.login);

router.get('/logout', users.logout);

module.exports = router;