const db = require('../utils/db');
const categoryModel = require('./category.model');
const registedCourseModel = require('./registedCourse.model');
const voteModel = require('./vote.model');

const TBL_COURSES = 'courses';

module.exports = {
  all() {
    return db.load('select * from courses');
  },

  byCat(catId) {
    return db.load(`select * from ${TBL_COURSES} where courseCatId = ${catId}`);
  },

  async single(id) {
    const rows = await db.load(`select * from ${TBL_COURSES} where courseID = '${id}'`);
    if (rows.length === 0)
      return null;

    rows[0].courseRegistered = await registedCourseModel.countStudents(id);
    rows[0].coursePointEval = await voteModel.avgVote(id);
    rows[0].coursePointEval = Math.round(rows[0].coursePointEval * 10) / 10;
    rows[0].courseAmountEval = await voteModel.countVote(id);
    const Cate = await categoryModel.single(rows[0].courseCatLevel2ID);
    rows[0].courseCatName = Cate.catName;
    rows[0].courseNewPrice = rows[0].coursePrice * (100 - rows[0].courseDiscount) / 100;
    rows[0].courseUpdatedAt.setHours(rows[0].courseUpdatedAt.getHours() + 7);
    rows[0].courseUpdatedAt = rows[0].courseUpdatedAt.toISOString().slice(0, 19).replace('T', ' ');

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
