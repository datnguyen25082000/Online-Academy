const db = require('../utils/db');

const TBL_CATEGORIES = 'categoriesLevel2';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_CATEGORIES}`);
  },

  allWithDetails() {
    const sql = `
      select c.*, count(p.courseId) as CourseCount
      from categories c left join courses p on c.catID = p.courseCatId
      group by c.catID, c.catName
    `;
    return db.load(sql);
  },

  async single(id) {
    const rows = await db.load(`select * from ${TBL_CATEGORIES} where catID = '${id}'`);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  add(entity) {
    return db.add(entity, TBL_CATEGORIES)
  },

  del(entity) {
    const condition = { CatID: entity.catID };
    return db.del(condition, TBL_CATEGORIES);
  },

  patch(entity) {
    const condition = { CatID: entity.catID };
    delete entity.catID;
    return db.patch(entity, condition, TBL_CATEGORIES);
  }
};
