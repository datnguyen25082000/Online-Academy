const db = require("../utils/db");

const TBL_REGISTED = "registed";
const TBL_COURSES = 'courses';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_REGISTED}`);
  },

  async countStudents(courseID) {
    const row = await db.load(`select count(courseID) as amount from ${TBL_REGISTED} where courseID = '${courseID}'`);
    return row[0].amount;
  },

  async byUsername(username) {
    const rows = await db.load(`select * 
                    from ${TBL_REGISTED} r 
                    join ${TBL_COURSES} c on c.courseID = r.courseID
                    left join (
                      select avg(voteValue) as point, votes.voteCourse
                          from votes) as v on v.voteCourse = c.courseID
                    where username = '${username}'`);
    rows.forEach(row => {
      if (row.point) {
        row.coursePointEval = row.point;
      }
    });
    return rows;
  },

  add(entity) {
    return db.add(entity, TBL_REGISTED);
  },

  del(entity) {
    const condition = {
      userUsername: entity.userUsername,
      courseID: entity.courseID
    };
    return db.del(condition, TBL_REGISTED);
  },

  async single (username, courseID) {
    const rows = await db.load(
      `select * 
        from ${TBL_REGISTED}
        where username = '${username}' and courseID = '${courseID}' `
    );
    if (rows.length === 0) return null;

    return rows[0];
  },
};
