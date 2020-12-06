const categoryModel = require('../models/category.model');

module.exports = async function (req, res, next) {
  const rows = await categoryModel.allWithDetails();
  res.locals.lcCategories = rows;
  next();
}