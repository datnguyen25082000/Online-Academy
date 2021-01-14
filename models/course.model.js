const db = require('../utils/db');

const TBL_COURSES = 'courses';
const limitPage = process.env.LIMIT_PAGE;
const maxCourseHomepage = process.env.MAX_COURSE_HOMEPAGE;


module.exports = {

  // phân trang tất cả các khóa học
  allPage(page) {
    return db.load(`select * from courses limit ${limitPage} offset ${page}`);
  },

  // phân trang khóa học theo lĩnh vực
  byCatPage(catId, page) {
    return db.load(`select * from ${TBL_COURSES} where courseCatLevel2ID = ${catId} limit ${limitPage} offset ${page}`);
  },

  // phân trang tìm kiếm FTS
  fullTextSearchPage(text, page) {
    return db.load(`select * from ${TBL_COURSES} where match(courseName) AGAINST('${text}') limit ${limitPage} offset ${page}`);
  },

  // tất cả các khóa học
  all() {
    return db.load('select * from courses');
  },

  // số lượng khóa học
  allCount() {
    return db.load(`select count(*) as total from ${TBL_COURSES}`);
  },

  // tìm kiếm khóa học theo ID lĩnh vực
  byCat(catId) {
    return db.load(`select count(*) as total from ${TBL_COURSES} where courseCatLevel2ID = ${catId}`);
  },

  // fullTextSearch
  fullTextSearch(text) {
    return db.load(`select count(*) as total from ${TBL_COURSES} where match(courseName) AGAINST('${text}') `);
  },

  // tìm khóa học bằng id
  async single(id) {
    const rows = await db.load(`select * from ${TBL_COURSES} where courseID = '${id}'`);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  // khóa học nổi bật
  outStandingCourse() {
    return rows = db.load(`select * from ${TBL_COURSES} ORDER BY coursePointEval DESC LIMIT 4 `);
  },

  // khóa học được xem nhiều nhất
  mostViewedCourse() {
    return rows = db.load(`select * from ${TBL_COURSES} ORDER BY courseRegistered DESC LIMIT ${maxCourseHomepage}`);
  },

  // khóa học mới nhất
  latestCourse() {
    return rows = db.load(`select * from ${TBL_COURSES} ORDER BY courseUpdatedAt DESC LIMIT ${maxCourseHomepage}`);
  },

  async all_lecturer(lecturerName) {
    const rows = await db.load(`select * from ${TBL_COURSES} where courseLecturer ='${lecturerName}'`);
    return rows;
  },

  async chooseID() {
    const ID = await db.load(`SELECT MAX(courseID) as max FROM ${TBL_COURSES}`);
    return ID[0];
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
