const express = require('express');
const productModel = require('../../models/product.model');

const router = express.Router();

router.get('/byCat/:id', async function (req, res) {
  const catId = req.params.id;

  for (const c of res.locals.lcCategories) {
    if (c.CatID === +catId) {
      c.isActive = true;
    }
  }

  const rows = await productModel.byCat(catId);
  res.render('vwProducts/byCat', {
    products: rows,
    empty: rows.length === 0
  })
})

module.exports = router;