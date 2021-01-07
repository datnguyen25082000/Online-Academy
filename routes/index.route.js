const express = require('express');
const courseModel = require('../models/course.model');
const watchListModel = require('../models/watchList.model');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated } = require('./controllers/auth');

// Welcome Page
router.get('/', forwardAuthenticated, async (req, res) => {
  try {
    const rows = await courseModel.all();
    res.render('home', {
      topTrending: rows.slice(0,4),
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
  let rows = await courseModel.all();
  const favorites = await watchListModel.byUsername(req.session.passport.user.userUsername);

  for (let i = 0; i < rows.length; i++) {
    rows[i].isFavorite = false;
    for(let j = 0; j < favorites.length; j++) {
      if (rows[i].courseID == favorites[j].courseID) {
        rows[i].isFavorite = true;
      }
    }
  }

  res.render('home', {
    topTrending: rows.slice(0,4),
    empty: rows.length === 0,
    user: req.user,
  })
}
);

module.exports = router;