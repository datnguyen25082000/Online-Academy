const express = require('express');
const exphbs = require('express-handlebars');
const numeral = require('numeral');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

require('dotenv');
// Passport Config
require('./controllers/passport')(passport);

dotenv.config({path: './.env'});
app.use(express.urlencoded({
  extended: true
}));
// app.use(cookieParser('mysupersecretcookiesstring'));

// VIEW ENGINE
app.engine('hbs', exphbs({
  defaultLayout: 'main.hbs',
  extname: '.hbs',
  layoutsDir: 'views/_layouts',
  partialsDir: 'views/_partials',
  helpers: {
    format(val) {
      return numeral(val).format('0,0');
    }
  }
}));
app.set('view engine', 'hbs');

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// STATIC FILE
app.use('/public', express.static('public'));



// MIDDLEWARE
// app.use(require('./middleware/locals.mdw'));

///------------------- ROUTE ---------------------///

// DEFAULT
app.use('/', require('./routes/index.route'));

app.use('/auth', require('./routes/auth.route'));

// ROUTE THAO TÁC VỚI TÀI KHOẢN USER: THÔNG TIN, THAY ĐỔI MẬT KHẨU,...
app.use('/user', require('./routes/user.route'));

// CLIENT ERROR
app.use(function (req, res) {
  res.render('404', {
    layout: false
  })
});

// DEFAULT ERROR HANDER - SERVER ERROR
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.render('500', {
    layout: false
  })
})

// START 
const PORT = 3000;
app.listen(PORT, _ => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});