const express = require('express');
const courseModel = require('../models/course.model');
const categoriesLevelModel = require('../models/category.model');
const registedCourseModel = require('../models/registedCourse.model');
const watchListModel = require('../models/watchList.model');
const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated, userAuthenticated, adminAuthenticated } = require("./controllers/auth");
const multer = require('multer');
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

router.get('/registed', async function (req, res) {
    const rows = await registedCourseModel.byUsername(req.session.passport.user.userUsername);

    // const courses = await courseModel.byID(rows.courseID);
    res.render('vwCourses/registed', {
        courses: rows,
        empty: rows.length === 0
    })
})

router.get('/watchList', ensureAuthenticated, async function (req, res) {
    const rows = await watchListModel.byUsername(req.session.passport.user.userUsername);

    // const courses = await courseModel.byID(rows.courseID);
    res.render('vwCourses/watchList', {
        courses: rows,
        empty: rows.length === 0
    })
})

router.post('/add', function (req, res) {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, '../public/imagesCourse')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    });

    var upload = multer({ storage: storage }).single('avatar-2');
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
        } else {
            res.render('vwCourses/add')
        }
    });
    /*

    const { avatar, courseName, short_des, full_des, price, discount, lessons } = req.body;
    let errors = [];

    if (!courseName || !short_des || !full_des || !price) {
        errors.push({ msg: 'Please enter all fields' });
    }

    console.log(req.body);
    //console.log(avatar);
    //console.log(courseName);
    console.log(short_des);
    console.log(full_des);
    console.log(price);
    //console.log(discount);
    for (i = 0; i < lessons.length; i++) {
        console.log(lessons[i]);
    }
    if (errors.length > 0) {
        res.render('vwCourses/add', {
            err: true,
            errorMsg: errors[0].msg
        });
    } else {
        courseModel.single(courseName).then(course => {
            if (course) {
                // errors.push({ msg: 'Email already exists' });
                // res.render('register', {
                //     err: true,
                //     errorMsg: errors[0].msg,
                //     layout: false
                // });
            } else {
                // bcrypt.genSalt(10, (err, salt) => {
                //     bcrypt.hash(password, salt, (err, hash) => {
                //         if (err) throw err;

                //         User.add({ userUsername: username, userPassword: hash, userType: 1, userEmail: email, userDisplayName: name })

                //         res.redirect('/auth/login');
                //     });
                // });
            }
        });
    }
    */
})

router.post('/del', ensureAuthenticated, async function (req, res) {
    const ret = await courseModel.del(req.body);
})

router.post('/patch', ensureAuthenticated, async function (req, res) {
    const ret = await courseModel.patch(req.body);
    res.redirect('/courses');
})

router.get('/:id', async function (req, res) {
    const id = req.params.id;
    const course = await courseModel.single(id);
    const rows = await courseModel.all();
    if (course === null) {
        return res.redirect('/courses');
    }

    res.render('vwCourses/detail', {
        course,
        topTrending: rows.slice(0, 5),
    });
})


module.exports = router;