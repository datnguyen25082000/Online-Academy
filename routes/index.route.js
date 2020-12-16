const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated } = require('../routes/controllers/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('home'));


// Dashboard
router.get('/dashboard', typeAuthenticated, (req, res) =>
  res.render('user', {
    user: req.user,
  })
);

module.exports = router;