const express = require('express');
const courseModel = require('../models/course.model');
const categoriesLevelModel = require('../models/category.model');
const registedCourseModel = require('../models/registedCourse.model');
const watchListModel = require('../models/watchList.model');
const lessonModel = require('../models/lesson.model')
const sharp = require('sharp')
const learnModel = require('../models/learn.model')
const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated, userAuthenticated, adminAuthenticated } = require("./controllers/auth");
const multer = require('multer');
const lessonsModel = require('../models/lessons.model');
var mkdirp = require('mkdirp');
const { route } = require('./lecturer.route');


const router = express.Router();
const limitPage = process.env.LIMIT_PAGE;


router.get('/', adminAuthenticated, async function (req, res) {
    try {
        const rows = await courseModel.all();
        res.render('vwCourses/index', {
            courses: rows,
            empty: rows.length === 0
        });
    } catch (err) {
        res.send('View error log at server console.');
    }
})

router.get('/listCourse/', async function (req, res) {
    const pageNumber = req.query.page || 1;
    let listCourse = await courseModel.allPage((pageNumber - 1) * limitPage);
    let rating = "", price = "";

    const totalResult = await courseModel.allCount();
    const total = totalResult[0].total;
    nPage = Math.ceil(total / limitPage);
    const page_items = [];
    for (i = 1; i <= nPage; i++) {
        const item = {
            value: i
        }
        page_items.push(item);
    }

    try {
        rating = req.query.rating;
        price = req.query.price;
    } catch (error) {

    }

    try {
        if (rating !== undefined) {
            for (i = 0; i < listCourse.length; i++) {
                if (Math.round(parseInt(listCourse[i].coursePointEval)) < parseInt(rating)) {
                    listCourse.splice(i, 1);
                }
            }
        }
    } catch (error) {

    }

    if (price !== undefined) {
        if (price === 'asc')
            listCourse.sort((a, b) => (a.coursePrice > b.coursePrice) ? 1 : -1)
        else
            listCourse.sort((a, b) => (a.coursePrice < b.coursePrice) ? 1 : -1)
    }

    if (price !== undefined) {
        if (price === 'asc')
            price = 'Tăng dần'
        else
            price = 'Giảm dần'
    }

    res.render('vwCourses/listCourseIndex', {
        listCourse,
        price,
        nPage,
        prev_value: parseInt(pageNumber) - 1,
        next_value: parseInt(pageNumber) + 1,
        can_go_prev: pageNumber > 1,
        can_go_next: pageNumber < nPage,
        page_items,
        rating
    });
})

router.get("/add", function (req, res) {
    res.render("vwCourses/add");
});

router.get('/listCourse/:id', async function (req, res) {
    const pageNumber = req.query.page || 1;
    const category = req.params.id;

    const listCourse = await courseModel.byCatPage(category, (pageNumber - 1) * limitPage);
    const catLevel2 = await categoriesLevelModel.single(category);
    const totalResult = await courseModel.byCat(category);

    const total = totalResult[0].total;
    nPage = Math.ceil(total / limitPage);
    const page_items = [];
    for (i = 1; i <= nPage; i++) {
        const item = {
            value: i
        }
        page_items.push(item);
    }

    if (listCourse.length === 0)
        empty = true;
    else
        empty = false;

    let rating = "", price = "";

    try {
        rating = req.query.rating;
        price = req.query.price;
    } catch (error) {

    }

    try {
        if (rating !== undefined) {
            for (i = 0; i < listCourse.length; i++) {
                if (Math.round(parseInt(listCourse[i].coursePointEval)) < parseInt(rating)) {
                    listCourse.splice(i, 1);
                }
            }
        }
    } catch (error) {

    }

    if (price !== undefined) {
        if (price === 'asc')
            listCourse.sort((a, b) => (a.coursePrice > b.coursePrice) ? 1 : -1)
        else
            listCourse.sort((a, b) => (a.coursePrice < b.coursePrice) ? 1 : -1)
    }

    if (price !== undefined) {
        if (price === 'asc')
            price = 'Tăng dần'
        else
            price = 'Giảm dần'
    }

    res.render('vwCourses/listCourse', {
        catLevel2,
        listCourse,
        empty,
        page_items,
        nPage,
        prev_value: parseInt(pageNumber) - 1,
        next_value: parseInt(pageNumber) + 1,
        can_go_prev: pageNumber > 1,
        can_go_next: pageNumber < nPage,
        rating,
        price,
    });
})

router.get('/search/', async function (req, res) {
    const pageNumber = req.query.page || 1;
    const dataSearch = req.query.dataSearch;

    const totalResult = await courseModel.fullTextSearch(dataSearch);
    const total = totalResult[0].total;
    nPage = Math.ceil(total / limitPage);
    const page_items = [];
    for (i = 1; i <= nPage; i++) {
        const item = {
            value: i
        }
        page_items.push(item);
    }

    const listCourse = await courseModel.fullTextSearchPage(dataSearch, (pageNumber - 1) * limitPage);
    if (listCourse.length === 0)
        empty = true
    else
        empty = false

    let rating = "", price = "";

    try {
        rating = req.query.rating;
        price = req.query.price;
    } catch (error) {

    }

    try {
        if (rating !== undefined) {
            for (i = 0; i < listCourse.length; i++) {
                if (Math.round(parseInt(listCourse[i].coursePointEval)) < parseInt(rating)) {
                    listCourse.splice(i, 1);
                }
            }
        }
    } catch (error) {

    }

    if (price !== undefined) {
        if (price === 'asc')
            listCourse.sort((a, b) => (a.coursePrice > b.coursePrice) ? 1 : -1)
        else
            listCourse.sort((a, b) => (a.coursePrice < b.coursePrice) ? 1 : -1)
    }

    if (price !== undefined) {
        if (price === 'asc')
            price = 'Tăng dần'
        else
            price = 'Giảm dần'
    }
    res.render('vwCourses/listCourseIndex', {
        listCourse,
        dataSearch,
        empty,
        prev_value: parseInt(pageNumber) - 1,
        next_value: parseInt(pageNumber) + 1,
        can_go_prev: pageNumber > 1,
        can_go_next: pageNumber < nPage,
        page_items,
        nPage,
        price,
        rating
    });


})

//Adding an Course Pages
router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('vwCourses/add');
})

router.get('/watchList', ensureAuthenticated, async function (req, res) {
    const rows = await watchListModel.byUsername(req.session.passport.user.userUsername);

    // const courses = await courseModel.byID(rows.courseID);
    res.render('vwCourses/watchList', {
        courses: rows,
        empty: rows.length === 0
    })
})

//Adding an Course -- post
router.post('/add', async function (req, res) {
    let errors = [];
    let thiscourseID = await courseModel.chooseID();
    var courseID = Object.values(JSON.parse(JSON.stringify(thiscourseID)));
    courseID = parseInt(courseID) + 1;

    var filename = "course-img";

    var des_save = "/public/imagesCourse/" + courseID + "/";
    var des_file = "." + des_save;
    console.log(des_file);

    mkdirp(des_file, function (err) {

    });

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, des_file)
        },
        filename: function (req, file, cb) {
            //filename = file.originalname;
            cb(null, file.originalname)
        }
    });

    var upload = multer({ storage: storage }).single('avatar-2');

    upload(req, res, async function (err) {
        if (!req.body && !req.file) {
            res.json({ success: false });
        } else {
            console.log(req.file);
            var string = req.file.originalname;
            console.log(string);
            var filetype = string.slice(string.indexOf("."), string.length);
            console.log(filetype);
            sharp(req.file.path).resize(250, 140).toFile(des_file + filename + "-thumbs" + '.png', function (err) {
                if (err) {
                    console.error('sharp>>>', err)
                }
            })

            sharp(req.file.path).resize(500, 300).toFile(des_file + filename + '.png', function (err) {
                if (err) {
                    console.error('sharp>>>', err)
                }
            })
        }

        if (err) {
            // An error occurred when uploading
            console.log(err);
        } else {
            const { courseName, short_des, full_des, price, discount, lesson } = req.body;
            console.log(req.body);

            if (!courseName || !short_des || !full_des || !price) {
                console.log('enter all filed r ')
                errors.push({ msg: 'Please enter all fields' });
            }

            if (!(lesson === undefined)) {
                for (i = 0; i < lesson.length; i++) {
                    console.log(lesson[i]);
                }
            }

            console.log(lesson)
            if (errors.length > 0) {
                console.log('abc');
                res.render('vwCourses/add', {
                    err: true,
                    errorMsg: errors[0].msg
                });
                return;
            } else {
                await courseModel.single(courseID).then(async course => {
                    if (course) {
                        errors.push({ msg: 'Course already exists' });
                        res.render('vwCourses/add', {
                            err: true,
                            errorMsg: errors[0].msg
                        });
                    } else {
                        const lecturerUsername = res.locals.user.userUsername;
                        console.log(lecturerUsername)
                        const date = new Date().toISOString().slice(0, 9).replace('T', ' ');
                        await courseModel.add({
                            courseID: courseID,
                            courseLecturer: lecturerUsername,
                            courseCatLevel2ID: 1,
                            courseName: courseName,
                            courseDes: short_des,
                            courseDetail: full_des,
                            courseImage: "/public/imagesCourse/" + courseID + "/" + filename,
                            coursePrice: price,
                            courseDiscount: discount,
                            courseUpdatedAt: date,
                            done: 0
                        });

                        if (!(lesson === undefined)) {
                            console.log('vào lesson')
                            for (i = 0; i < lesson.length - 1; i++) {
                                lessonsModel.add({
                                    courseID: courseID,
                                    lessonName: lesson[i],
                                    lessonID: i,
                                    lessonLinkVideo: "/",
                                    lessonLinkDocument: "/",
                                    done: 0
                                });
                            }
                        }

                    }
                });
            }
            res.redirect('upload_course/' + courseID);
        }
    });

})

//Manage an course lesson -- get
router.get('/upload_course/:courseID', async function (req, res) {
    const courseID = req.params.courseID;
    const details = await courseModel.single(courseID);
    const lesson = await lessonsModel.all(courseID);

    lesson.forEach(item => {
        item.stt = item.lessonID + 1;
    });

    res.render('vwCourses/upload_file', {
        course: details,
        lesson_items: lesson,
        empty: lesson.length === 0
    });
})

//Adding an Lessons -- post
router.post('/upload_course/:courseID/:lessonID', async function (req, res) {

    var filename = "";
    const courseID = req.params.courseID;
    const lessonID = req.params.lessonID;
    console.log(courseID);
    console.log(lessonID);

    var des_save = "/public/imagesCourse/" + courseID + "/" + lessonID + "/";

    var des_file = "." + des_save;
    console.log(des_file);

    mkdirp(des_file, function (err) {

    });


    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, des_file)
        },
        filename: function (req, file, cb) {
            filename = file.originalname;
            cb(null, file.originalname)
        }
    });
    const upload = multer({ storage: storage });
    upload.array('dom_' + lessonID, 2)(req, res, async function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.render({
                done: 0
            });
        } else {
            console.log("success");
            //const ret = await lessonsModel.patch(req.body);
            const { courseID, lessonID, lessonName } = req.body;


            await lessonsModel.patch({
                courseID: courseID,
                lessonName: lessonName,
                lessonID: lessonID,
                lessonLinkVideo: des_save,
                lessonLinkDocument: des_save,
                done: 1
            });

            lessonsModel.check_Done(courseID).then(check => {
                if (check) {
                    console.log(check);

                    console.log('this is exits');
                } else {
                    console.log('not exits');

                    courseModel.patch({
                        courseID: courseID,
                        done: 1
                    });
                }
            });


            res.redirect('../../upload_course/' + courseID);

        }
    });


})

//Edit course info -- get
router.get('/edit_course/:courseID', async function (req, res) {
    const courseID = req.params.courseID;
    const details = await courseModel.single(courseID);
    const lesson = await lessonsModel.all(courseID);

    lesson.forEach(item => {
        item.stt = item.lessonID + 1;
    });

    res.render('vwCourses/edit_info', {
        course: details,
        lesson_items: lesson,
        empty: lesson.length === 0
    });
})

//Edit course info -- post
router.post('/edit_course/:courseID', async function (req, res) {
    let errors = [];
    const courseID = req.params.courseID;

    console.log('thsi is debug');

    var filename = "course-img";

    var des_save = "/public/imagesCourse/" + courseID + "/";
    var des_file = "." + des_save;
    console.log(des_file);

    mkdirp(des_file, function (err) {

    });

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, des_file)
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    });

    var upload = multer({ storage: storage }).single('avatar-2');
    upload(req, res, async function (err) {
        let query = req.body;
        if (!req.body && !req.file) {
            res.json({ success: false });
        } else {
            console.log(req.file);
            var string = req.file.originalname;
            console.log(string);
            var filetype = string.slice(string.indexOf("."), string.length);
            console.log(filetype);
            sharp(req.file.path).resize(250, 140).toFile(des_file + filename + "-thumbs" + '.png', function(err) {
                if (err) {
                    console.error('sharp>>>', err)
                }
            })

            sharp(req.file.path).resize(500, 300).toFile(des_file + filename + '.png', function(err) {
                if (err) {
                    console.error('sharp>>>', err)
                }
            })
        }
        if (err) {
            // An error occurred when uploading
            console.log(err);
        } else {
            const { courseName, short_des, full_des, price, discount } = req.body;


            if (!courseName || !short_des || !full_des || !price) {
                errors.push({ msg: 'Please enter all fields' });
            }

            console.log(courseID);
            console.log(courseName);
            console.log(short_des);
            console.log(full_des);
            console.log(price);


            await courseModel.single(courseID).then(course => {
                if (course) {
                    courseModel.patch({
                        courseID: courseID,
                        courseCatLevel2ID: 1,
                        courseName: courseName,
                        courseDes: short_des,
                        courseDetail: full_des,
                        courseImage: "/public/imagesCourse/" + courseID + "/" + filename,
                        coursePrice: price,
                        courseDiscount: discount
                    });
                } else {
                    errors.push({ msg: 'Course does not exists' });
                    res.render('vwCourses/edit_info', {
                        err: true,
                        errorMsg: errors[0].msg
                    });
                }
            });

            res.redirect('/courses/upload_course/' + courseID);
        }
    });
})

router.post('/del', ensureAuthenticated, async function (req, res) {
    const ret = await courseModel.del(req.body);
})

router.post('/patch', ensureAuthenticated, async function (req, res) {
    const ret = await courseModel.patch(req.body);
    res.redirect('/courses');
})

router.get("/registed", async function (req, res) {
    let rows = await registedCourseModel.byUsername(
        req.session.passport.user.userUsername
    );
    const favorites = await watchListModel.byUsername(
        req.session.passport.user.userUsername
    );

    for (let i = 0; i < rows.length; i++) {
        rows[i].isFavorite = false;
        for (let j = 0; j < favorites.length; j++) {
            if (rows[i].courseID == favorites[j].courseID) {
                rows[i].isFavorite = true;
            }
        }
    }

    res.render("vwCourses/registed", {
        courses: rows,
        empty: rows.length === 0,
    });
});

//learn
router.get("/learn", async function (req, res) {
    let id = +req.query.courseID;
    const lessons = await lessonModel.byCourse(id);
    const learns = await learnModel.byUsernameAndCourseID(req.session.passport.user.userUsername, id);
    console.log(learns);

    let lesson = +req.query.lessonID || 1;
    let unit = +req.query.unit || 1;

    for (let i = 0; i < lessons.length; i++) {
        let obj = [];
        for (let j = 0; j < lessons[i].lessonNumberUnit; j++) {
            obj[j] = {};
            obj[j].name = j + 1;
            obj[j].isLearn = false;
        }
        lessons[i].units = obj;
    }

    learns.forEach((learn) => {
        lessons[learn.learnLesson - 1].units[learn.learnUnit - 1].isLearn = true;
    })

    console.log(lessons[0].units);
    console.log(lessons[1].units);

    res.render("vwCourses/learn", {
        lessons,
        id,
        lesson,
        unit,
        empty: lessons.length === 0
    });
});

router.post('/add_lesson/:courseID', async function (req, res) {
    const courseID = req.params.courseID;

    await lessonsModel.add({
        courseID: courseID,
        lessonID: lessonID,
        done: 0
    });

    // const details = await courseModel.single(courseID);
    // const lesson = await lessonsModel.all(courseID);

    // lesson.forEach(item => {
    //     item.stt = item.lessonID + 1;
    // });

    // res.render('vwCourses/upload_file', {
    //     course: details,
    //     lesson_items: lesson,
    //     empty: lesson.length === 0
    // });

    res.redirect('upload_course/' + courseID);

})

router.get("/:id", async function (req, res) {
    const id = req.params.id;
    let favorite = null;
    let registed = null;
    const course = await courseModel.single(id);
    let rows = await courseModel.all();

    if (req.session.passport != undefined) {
        favorite = await watchListModel.single(req.session.passport.user.userUsername, id);
        registed = await registedCourseModel.single(req.session.passport.user.userUsername, id);

        const favorites = await watchListModel.byUsername(
            req.session.passport.user.userUsername
        );

        for (let i = 0; i < rows.length; i++) {
            rows[i].isFavorite = false;
            for (let j = 0; j < favorites.length; j++) {
                if (rows[i].courseID == favorites[j].courseID) {
                    rows[i].isFavorite = true;
                }
            }
        }
    }

    if (course === null) {
        return res.redirect("/courses");
    }

    res.render("vwCourses/detail", {
        course,
        isFavorite: favorite != null,
        isRegistered: registed != null,
        topTrending: rows.slice(0, 5),
    });
});


module.exports = router;
