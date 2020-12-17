const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/user.model');
const { forwardAuthenticated } = require('./controllers/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', {
  layout: false
}));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register' , {
  layout: false
}));

// Register
router.post('/register', (req, res) => {
  const { name, email, username, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2 || !username) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    console.log(errors[0].msg)
    res.render('register', {
      err: true,
      errorMsg: errors[0].msg,
      layout: false
    });
  } else {
    User.single(username).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          err: true,
          errorMsg: errors[0].msg,
          layout: false
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;

            User.add({ userUsername: username, userPassword: hash, userType: 1, userEmail: email, userDisplayName: name })

            res.redirect('/auth/login');
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/auth/login');
});

// check username
router.get('/is-available', async function (req, res) {
  const username = req.query.user;
  const user = await User.singleByUsername(username);
  if (user === null) {
    return res.json(true);
  }
  res.json(false);
})

module.exports = router;