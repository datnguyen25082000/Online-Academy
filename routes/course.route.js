const express = require('express');
const courseModel = require('../models/course.model');

const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const rows = await productModel.all();
    res.render('vwCourses/index', {
      courses: rows,
      empty: rows.length === 0
    });
  } catch (err) {
    console.error(err);
    res.send('View error log at server console.');
  }
})

module.exports = router;