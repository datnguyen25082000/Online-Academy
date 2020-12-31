const express = require('express');
const UserModel = require('../models/user.model');

const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated, userAuthenticated } = require('./controllers/auth');
const userModel = require('../models/user.model');

router.get('/', async function (req, res) {
    console.log("asdf");
  const rows = await UserModel.all();
  res.render('vwUsers/index', {
    users: rows,
    empty: rows.length === 0
  });
})

router.get('/add', function (req, res) {
  res.render('vwUsers/add');
})

router.post('/add', async function (req, res) {
  const ret = await UserModel.add(req.body);
})

router.post('/del', async function (req, res) {
  const ret = await UserModel.del(req.body);
})

router.post('/patch', async function (req, res) {
  const ret = await UserModel.patch(req.body);
  res.redirect('/users');
})


// Profile
router.get('/profile', function (req, res) {
    console.log(req.session.passport.user.userUsername);
 
    const info = req.session.passport.user;

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

router.get('/:id', async function (req, res) {
  const id = req.params.id;
  const user = await UserModel.single(id);
  if (user === null) {
    return res.redirect('/users');
  }
  res.render('vwUsers/edit', {
    editUser: user
  });
})

module.exports = router;