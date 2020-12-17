const express = require('express');
const UserModel = require('../models/user.model');

const router = express.Router();

router.get('/', async function (req, res) {
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
  console.log(req.body)
  const ret = await UserModel.add(req.body);
  res.render('vwUsers/add');
})

router.post('/del', async function (req, res) {
  console.log(req.body)
  const ret = await UserModel.del(req.body);
  res.redirect('/users');
})

router.post('/patch', async function (req, res) {
  const ret = await UserModel.patch(req.body);
  res.redirect('/users');
})

router.get('/:id', async function (req, res) {
  const id = req.params.id;
  console.log(id)
  const user = await UserModel.single(id);
  if (user === null) {
    return res.redirect('/users');
  }

  res.render('vwUsers/edit', {
    user
  });
})

module.exports = router;