const db = require('../utils/db');

const TBL_LESSONS = 'lessons';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_LESSONS}`);
  },

  byCourse(courseID) {
    return db.load(`select * from ${TBL_LESSONS} where courseID = ${courseID}`);
  },

  allWithDetails() {
    const sql = `
      select c.*, count(p.courseId) as CourseCount
      from ${TBL_LESSONS} 
    `;
    return db.load(sql);
  },

  async single(id) {
    const rows = await db.load(`select * from ${TBL_LESSONS} where catID = '${id}'`);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  add(entity) {
    return db.add(entity, TBL_LESSONS)
  },

  del(entity) {
    const condition = { catID: entity.catID };
    return db.del(condition, TBL_LESSONS);
  },

  patch(entity) {
    const condition = { catID: entity.catID };
    delete entity.catID;
    return db.patch(entity, condition, TBL_LESSONS);
  }
};
