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
  try {
    const ret = await UserModel.add(req.body);
    res.status(200).send({ 'added': true });
  } catch (error) {
    res.status(200).send({ 'added': false })
  }
})

router.post('/del', async function (req, res) {
  const ret = await UserModel.del(req.body);
})

router.post('/patch', async function (req, res) {
  try {
    const ret = await UserModel.patch(req.body);
    res.status(200).send({ 'saved': true });
  } catch (error) {
    res.status(200).send({ 'saved': false })
  }
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