const db = require("../utils/db");

const TBL_REGISTED = "registed";
const TBL_COURSES = 'courses';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_REGISTED}`);
  },

  byUsername(username) {
    return db.load(`select * 
                    from ${TBL_REGISTED} r join ${TBL_COURSES} c on c.courseID = r.courseID
                    where username = '${username}'`);
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

  async single(id) {
    const rows = await db.load(
      `select * from ${TBL_REGISTED} where userUsername = '${id}' `
    );
    if (rows.length === 0) return null;

    return rows[0];
  },
};
