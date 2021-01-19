const db = require("../utils/db");

const TBL_FAVORITES = "favorites";
const TBL_COURSES = 'courses';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_FAVORITES}`);
  },



  async byUsername(username) {
    const rows = await db.load(`select * 
                    from ${TBL_FAVORITES} r 
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
    return db.add(entity, TBL_FAVORITES);
  },

  del(entity) {
    const condition1 = { 
      username: entity.username
    };
    const condition2 = {
      courseID: entity.courseID
    }
    return db.delWith2Condition(condition1, condition2, TBL_FAVORITES);
  },

  async single (username, courseID) {
    const rows = await db.load(
      `select * 
        from ${TBL_FAVORITES}
        where username = '${username}' and courseID = '${courseID}' `
    );
    if (rows.length === 0) return null;

    return rows[0];
  },
};
