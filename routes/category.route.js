const express = require('express');
const categoryModel = require('../models/category.model');
const router = express.Router();

router.get('/', async function (req, res) {
  console.log('get cate')
  const rows = await categoryModel.all();
  res.render('vwCategories/index', {
    categories: rows,
    empty: rows.length === 0
  });
})

router.get('/add', function (req, res) {
  console.log('adadad')
  res.render('vwCategories/add');
})

router.post('/add', async function (req, res) {
  const ret = await categoryModel.add(req.body);
  res.render('vwCategories/add');
})

router.post('/del', async function (req, res) {
  console.log(req.body)
  const ret = await categoryModel.del(req.body);
  res.redirect('/categories');
})

router.post('/patch', async function (req, res) {
  const ret = await categoryModel.patch(req.body);
  res.redirect('/categories');
})

router.get('/:id', async function (req, res) {
  const id = req.params.id;
  const category = await categoryModel.single(id);
  if (category === null) {
    return res.redirect('/categories');
  }

  res.render('vwCategories/edit', {
    category
  });
})

module.exports = router;