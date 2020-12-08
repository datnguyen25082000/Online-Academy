module.exports = {
  ensureAuthenticated: function (req, res, next) {
    console.log('vào ensure roi ne');
    if (req.isAuthenticated()) {
      console.log('vao authen roi ne')
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/auth/login');
  },

  typeAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      // ADMIN
      if (req.user.userType === 0) {
        return res.render('admin', {
          user: req.user,
          layout: false
        })
      }
      // AUTHOR
      else if (req.user.userType === 2) {
        return res.render('author', {
          user: req.user,
          layout: false
        })
      }
      // USER
      else
        return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/auth/login');
  },

  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');
  }
};
