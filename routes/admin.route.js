const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated } = require('../routes/controllers/auth');

// Welcome Page
router.get('/account', (req, res) => {
    res.render('home');
})

module.exports = router;