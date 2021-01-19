const db = require("../utils/db");
const categoryModel = require("./category.model");
const registedCourseModel = require("./registedCourse.model");
const voteModel = require("./vote.model");

const TBL_COURSES = "courses";
const limitPage = process.env.LIMIT_PAGE;
const maxCourseHomepage = process.env.MAX_COURSE_HOMEPAGE;

module.exports = {
  // phân trang tất cả các khóa học
  allPage(page) {
    return db.load(
      `select * from courses left join users on users.userUsername = courses.courseLecturer limit ${limitPage} offset ${page}`
    );
  },

  // phân trang khóa học theo lĩnh vực
  byCatPage(catId, page) {
    return db.load(
      `select * from ${TBL_COURSES} left join users on users.userUsername = courses.courseLecturer where courseCatLevel2ID = ${catId} limit ${limitPage} offset ${page}`
    );
  },

  // phân trang tìm kiếm FTS
  fullTextSearchPage(text, page) {
    return db.load(
      `select * from ${TBL_COURSES} left join users on users.userUsername = courses.courseLecturer where match(courseName) AGAINST('${text}') limit ${limitPage} offset ${page}`
    );
  },

  // tất cả các khóa học
  async all() {
    const rows = await db.load(`
    select * 
    from courses
    left join (
      select avg(voteValue) as point, votes.voteCourse
          from votes) as v on v.voteCourse = courses.courseID
    `);
    rows.forEach(row => {
      if (row.point) {
        row.coursePointEval = row.point;
      }
    });
    return rows
  },

  // số lượng khóa học
  allCount() {
    return db.load(`select count(*) as total from ${TBL_COURSES}`);
  },

  // tìm kiếm khóa học theo ID lĩnh vực
  byCat(catId) {
    return db.load(
      `select count(*) as total from ${TBL_COURSES} where courseCatLevel2ID = ${catId}`
    );
  },

  // fullTextSearch
  fullTextSearch(text) {
    return db.load(
      `select count(*) as total from ${TBL_COURSES} where match(courseName) AGAINST('${text}') `
    );
  },

  // tìm khóa học bằng id
  async single(id) {
    const rows = await db.load(
      `select * from ${TBL_COURSES} where courseID = '${id}'`
    );
    if (rows.length === 0) return null;

    rows[0].courseRegistered = await registedCourseModel.countStudents(id);
    rows[0].coursePointEval = await voteModel.avgVote(id);
    rows[0].coursePointEval = Math.round(rows[0].coursePointEval * 10) / 10;
    rows[0].courseAmountEval = await voteModel.countVote(id);
    const Cate = await categoryModel.single(rows[0].courseCatLevel2ID);
    rows[0].courseCatName = Cate.catName;
    rows[0].courseNewPrice =
      (rows[0].coursePrice * (100 - rows[0].courseDiscount)) / 100;
    rows[0].courseUpdatedAt.setHours(rows[0].courseUpdatedAt.getHours() + 7);
    rows[0].courseUpdatedAt = rows[0].courseUpdatedAt
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    return rows[0];
  },

  // khóa học nổi bật
  async outStandingCourse() {
    const rows = await db.load(`
    select courses.*, users.userDisplayName, categorieslevel2.catName, c.sum, v.point
    from courses
    left join users on courses.courseLecturer = users.userUsername
    left join categorieslevel2 on courses.courseCatLevel2ID = categorieslevel2.catID
    left join (
	  select count(*) as sum, courseID
	  from reviews
	  group by reviews.courseID) as c on c.courseID = courses.courseID
	  left join (
		select avg(voteValue) as point, votes.voteCourse
        from votes) as v on v.voteCourse = courses.courseID
    ORDER BY v.point DESC, c.sum DESC LIMIT 4 `);
    rows.forEach(row => {
      if (row.point) {
        row.coursePointEval = row.point;
      }
    });
    return rows;
  },

  // khóa học được xem nhiều nhất
  async mostViewedCourse() {
    const rows = await db.load(`
    select courses.*, users.userDisplayName, categorieslevel2.catName, c.sum, v.point
    from courses
    left join users on courses.courseLecturer = users.userUsername
    left join categorieslevel2 on courses.courseCatLevel2ID = categorieslevel2.catID
    left join (
	  select count(*) as sum, courseID
	  from reviews 
	  group by reviews.courseID) as c on c.courseID = courses.courseID
	  left join (
		select count(*) as sumRegisted, courseID
        from registed
        group by registed.courseID) as r on r.courseID = courses.courseID
    left join (
      select avg(voteValue) as point, votes.voteCourse
      from votes) as v on v.voteCourse = courses.courseID
    ORDER BY sumRegisted DESC LIMIT ${maxCourseHomepage}`);
    rows.forEach(row => {
      if (row.point) {
        row.coursePointEval = row.point;
      }
    });
    return rows;
  },

  // khóa học mới nhất
  async latestCourse() {
    const rows = await db.load(`
    select courses.*, users.userDisplayName, categorieslevel2.catName, c.sum, v.point
    from courses
    left join users on courses.courseLecturer = users.userUsername
    left join categorieslevel2 on courses.courseCatLevel2ID = categorieslevel2.catID
    left join (
	  select count(*) as sum, courseID
	  from reviews 
    group by reviews.courseID) as c on c.courseID = courses.courseID
    left join (
      select avg(voteValue) as point, votes.voteCourse
          from votes) as v on v.voteCourse = courses.courseID
    ORDER BY courseUpdatedAt DESC LIMIT ${maxCourseHomepage}`);
    rows.forEach(row => {
      if (row.point) {
        row.coursePointEval = row.point;
      }
    });
    return rows;
  },

  async all_lecturer(lecturerName) {
    const rows = await db.load(
      `select * from ${TBL_COURSES}
      left join (
        select avg(voteValue) as point, votes.voteCourse
            from votes) as v on v.voteCourse = courses.courseID
       where courseLecturer ='${lecturerName}'`
    );
    rows.forEach(row => {
      if (row.point) {
        row.coursePointEval = row.point;
      }
    });
    return rows;
  },

  async chooseID() {
    const ID = await db.load(`SELECT MAX(courseID) as max FROM ${TBL_COURSES}`);
    return ID[0];
  },

  add(entity) {
    return db.add(entity, TBL_COURSES);
  },

  del(courseID) {
    db.load(`SET FOREIGN_KEY_CHECKS=0`);
    db.load(`delete from courses where courseID = '${courseID}'`);
    return db.load(`SET FOREIGN_KEY_CHECKS=1`);
  },

  patch(entity) {
    const condition = { courseID: entity.courseID };
    delete entity.courseID;
    return db.patch(entity, condition, TBL_COURSES);
  },
};
