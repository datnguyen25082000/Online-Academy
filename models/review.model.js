const db = require('../utils/db');

const TBL_REVIEWS = 'reviews';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_REVIEWS}`);
  },

  add(entity) {
    return db.add(entity, TBL_REVIEWS)
  },

  del(entity) {
    const condition = { userUsername: entity.userUsername };
    return db.del(condition, TBL_REVIEWS);
  },

  async single(id) {
    const rows = await db.load(`select * from ${TBL_REVIEWS} where userUsername = '${id}' `);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  patch(entity) {
    const condition = { userUsername: entity.userUsername };
    delete entity.userUsername;
    return db.patch(entity, condition, TBL_REVIEWS);
  }
};
