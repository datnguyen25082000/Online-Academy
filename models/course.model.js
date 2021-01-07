const db = require('../utils/db');

const TBL_COURSES = 'courses';
const limitPage = process.env.LIMIT_PAGE;

module.exports = {
  allPage(page) {
    return db.load(`select * from courses limit ${limitPage} offset ${page}`);
  },
  byCatPage(catId, page) {
    return db.load(`select * from ${TBL_COURSES} where courseCatLevel2ID = ${catId} limit ${limitPage} offset ${page}`);
  },
  fullTextSearchPage(text, page) {
    return db.load(`select * from ${TBL_COURSES} where match(courseName) AGAINST('${text}') limit ${limitPage} offset ${page}`);
  },

  all() {
    return db.load('select * from courses');
  },

  allCount() {
    return db.load(`select count(*) as total from ${TBL_COURSES}`);
  },

  byCat(catId) {
    return db.load(`select count(*) as total from ${TBL_COURSES} where courseCatLevel2ID = ${catId}`);
  },

  fullTextSearch(text) {
    return db.load(`select count(*) as total from ${TBL_COURSES} where match(courseName) AGAINST('${text}') `);
  },

  async single(id) {
    const rows = await db.load(`select * from ${TBL_COURSES} where courseID = '${id}'`);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  add(entity) {
    return db.add(entity, TBL_COURSES)
  },

  del(entity) {
    const condition = { courseID: entity.courseID };
    return db.del(condition, TBL_COURSES);
  },

  patch(entity) {
    const condition = { courseID: entity.courseID };
    delete entity.courseID;
    return db.patch(entity, condition, TBL_COURSES);
  }
};
