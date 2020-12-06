const express = require('express');
const productModel = require('../models/product.model');

const router = express.Router();

router.get('/', async function (req, res) {
  try {
    const rows = await productModel.all();
    res.render('vwProducts/index', {
      products: rows,
      empty: rows.length === 0
    });
  } catch (err) {
    console.error(err);
    res.send('View error log at server console.');
  }

  // const p = db.load('select * from products');
  // p.then(function (rows) {
  //   res.render('vwProducts/index', {
  //     products: rows,
  //     empty: rows.length === 0
  //   });
  // }).catch(function (err) {
  //   console.error(err);
  //   res.send('View error log at server console.');
  // });

  // db.load('select * from products', function (rows) {
  //   res.render('vwProducts/index', {
  //     products: rows,
  //     empty: rows.length === 0
  //   });
  // });
})

module.exports = router;