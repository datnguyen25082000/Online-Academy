const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated } = require('../controllers/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('home', { layout: false}));


// Dashboard
router.get('/dashboard', typeAuthenticated, (req, res) =>
  res.render('user', {
    user: req.user,
    layout: false
  })
);

module.exports = router;