const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated, userAuthenticated } = require('../controllers/auth');
const userModel = require('../models/user.model');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('home'));

// Profile
router.get('/profile', async function (req, res) {
    const info = await userModel.single('user');

    if (info === null) {
        return res.redirect('/');
    }
    let tab = req.query.tab;
    if (tab == null) {
        tab = 'general';
    }

    res.render("vwUsers/profile", {
        info: info,
        isGeneralTab: tab == 'general'
    });
});

//save info
router.post('/profile/save', async function (req, res) {
    const ret = await userModel.patch(req.body);
    res.redirect('/user/profile');
})


module.exports = router;