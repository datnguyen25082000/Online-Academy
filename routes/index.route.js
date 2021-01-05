const express = require('express');
const courseModel = require('../models/course.model');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated } = require('./controllers/auth');

// Welcome Page
router.get('/', forwardAuthenticated, async (req, res) => {
  try {
    const rows = await courseModel.all();
    res.render('home', {
      topTrending: rows.slice(0, 4),
      empty: rows.length === 0
    });
  } catch (err) {
    res.send('View error log at server console.');
  }
});

router.post('/updateSidebar', (req, res) => {
  return 1;
})


// Dashboard
router.get('/dashboard', typeAuthenticated, async (req, res) => {
  const rows = await courseModel.all();
  res.render('home', {
    topTrending: rows.slice(0, 4),
    empty: rows.length === 0,
    user: req.user,
  })
}
);

module.exports = router;