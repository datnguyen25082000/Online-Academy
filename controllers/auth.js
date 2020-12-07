module.exports = {
  ensureAuthenticated: function(req, res, next) {
    console.log('vào ensure roi ne');
    if (req.isAuthenticated()) {
      console.log('vao authen roi ne')
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/auth/login');
  },
  
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');      
  }
};
