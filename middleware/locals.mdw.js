const categoryModel = require('../models/category.model');

module.mdw1 = async function (req, res, next) {
  const rows = await categoryModel.allWithDetails();
  res.locals.lcCategories = rows;
  next();
}


exports.isAuthenticated = async function (req, res, next) {
  try {
    const options = {
      httpOnly: true,
      signed: true,
    };
   
    if (req.signedCookies.account === 'admin') {
      res.render('admin', { layout: false });
    }
    else if (req.signedCookies.account === 'user') {
      res.render('user', { layout: false });
    }
    else next();
  } catch (error) {
    next();
  }
}
