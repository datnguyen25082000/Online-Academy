const db = require('../utils/db');

const TBL_USERS = 'users';

module.exports = {
  all() {
    return db.load(`select * from ${TBL_USERS}`);
  },

  allRegister() {
    return db.load(`select * from ${TBL_USERS} where unchecked = 1`);
  },

  add(entity) {
    return db.add(entity, TBL_USERS)
  },

  del(entity) {
    const condition = { userUsername: entity.userUsername };
    return db.del(condition, TBL_USERS);
  },

  async single(id) {
    const rows = await db.load(`select * from ${TBL_USERS} where userUsername = '${id}' `);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  async singleEmail(id) {
    const rows = await db.load(`select * from ${TBL_USERS} where userEmail = '${id}' `);
    if (rows.length === 0)
      return null;

    return rows[0];
  },

  patch(entity) {
    const condition = { userUsername: entity.userUsername };
    delete entity.userUsername;
    return db.patch(entity, condition, TBL_USERS);
  },

  addLecturer(userUsername) {
    return db.load(`update ${TBL_USERS} set unchecked = 0 where userUsername = '${userUsername}'`);
  }


};
