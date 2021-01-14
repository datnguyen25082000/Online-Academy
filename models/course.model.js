const db = require('../utils/db');

const TBL_COURSES = 'courses';

module.exports = {
    all() {
        return db.load('select * from courses');
    },

    async all_lecturer(lecturerName) {
        const rows= await db.load(`select * from ${TBL_COURSES} where courseLecturer ='${lecturerName}'`);
        return rows;
    },

    byCat(catId) {
        return db.load(`select * from ${TBL_COURSES} where courseCatId = ${catId}`);
    },

    async single(id) {
        const rows = await db.load(`select * from ${TBL_COURSES} where courseID = '${id}'`);
        if (rows.length === 0)
            return null;

        return rows[0];
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