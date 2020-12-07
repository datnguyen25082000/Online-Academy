const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../controllers/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('home', { layout: false}));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  console.log('ok r ne')
  res.render('admin', {
    layout: false
  })
}
);

module.exports = router;