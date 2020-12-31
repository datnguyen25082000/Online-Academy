const express = require('express');
const courseModel = require('../models/course.model');

const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const rows = await courseModel.all();
    res.render('vwCourses/index', {
      courses: rows,
      empty: rows.length === 0
    });
  } catch (err) {
    
    res.send('View error log at server console.');
  }
})


router.get('/add', function (req, res) {
  res.render('vwCourses/add');

})

router.post('/add', async function (req, res) {
  const ret = await courseModel.add(req.body);
})

router.post('/del', async function (req, res) {
  const ret =  await courseModel.del(req.body);
})

router.post('/patch', async function (req, res) {
  const ret = await courseModel.patch(req.body);
  res.redirect('/courses');
})

router.get('/:id', async function (req, res) {
  const id = req.params.id;
  const course = await courseModel.single(id);
  const rows = await courseModel.all();
  if (course === null) {
    return res.redirect('/courses');
  }

  res.render('vwCourses/detail', {
    course,
    topTrending: rows.slice(0,5),
  });
})

module.exports = router;