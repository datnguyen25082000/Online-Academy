const express = require('express');
const exphbs = require('express-handlebars');
const numeral = require('numeral');
require('express-async-errors');

const app = express();

app.use(express.urlencoded({
  extended: true
}));

app.use('/public', express.static('public'));

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

app.use(require('./middlewares/locals.mdw'));

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/bs4', function (req, res) {
  const show = +req.query.show || 0;
  const visible = show !== 0;

  res.render('bs4', {
    layout: false,
    data: { visible: visible }
  });
});

// app.use('/', require('./routes/index.route'));
// app.use('/admin', require('./routes/index.route'));
// app.use('/', require('./routes/index.route'));
// app.use('/', require('./routes/index.route'));
// app.use('/admin/categories', require('./routes/category.route'));
// app.use('/admin/products', require('./routes/product.route'));
// app.use('/products', require('./routes/front/product.route'));


app.use(function (req, res) {
  res.render('404', {
    layout: false
  })
});

// default error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.render('500', {
    layout: false
  })
})

const PORT = 3000;
app.listen(PORT, _ => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});