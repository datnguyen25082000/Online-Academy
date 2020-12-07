const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const User = require('../models/user.model');
const { forwardAuthenticated } = require('../controllers/auth');
  

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', {layout: false}));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {layout: false}));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });}
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

module.exports = router;