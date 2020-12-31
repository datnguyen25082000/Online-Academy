const categoryModel = require('../models/category.model');

module.exports = function (app) {
  app.use(async function (req, res, next) {

    try {
      if (req.session.isActiveSidebar === undefined) {
        req.session.isActiveSidebar = false;
      }

      if (req.body.isActiveSidebar === "active") {
        var c = req.session.isActiveSidebar;
        if (c) {
          req.session.isActiveSidebar = false;
        }
        else
          req.session.isActiveSidebar = true;
      }
        
      req.session.save();
      res.locals.isActiveSidebar = req.session.isActiveSidebar
      res.locals.user = req.session.passport.user;
      next();
    } catch (error) {
      next();
    }
  })

  // app.use(async function (req, res, next) {
  //   const rows = await categoryModel.allWithDetails();
  //   res.locals.lcCategories = rows;
  //   next();
  // })
}