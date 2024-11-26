const User = require('../models/user');

module.exports.renderNewUserForm = (req, res) => {
  res.render('users/register');
}

module.exports.createNewUser = async (req, res) => {
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
}

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login');
};

module.exports.login = async (req, res) => {
  const redirectUrl = res.locals.returnTo || '/mountains';
  req.flash('success', 'Welcome back!');
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Goodbye!');
    res.redirect('/mountains');
  });
}