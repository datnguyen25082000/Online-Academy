const db = require('../utils/db');

module.exports = {
  all() {
    return db.load('select * from products');
  },

  byCat(catId) {
    return db.load(`select * from products where CatID = ${catId}`);
  },
};
