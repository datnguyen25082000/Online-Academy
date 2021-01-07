const express = require('express');
const courseModel = require('../models/course.model');
const categoriesLevelModel = require('../models/category.model');
const registedCourseModel = require('../models/registedCourse.model');
const watchListModel = require('../models/watchList.model');
const multer = require('multer');
const router = express.Router();

router.get('/', async function (req, res) {
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
    let listCourse = await courseModel.all();

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
        price,
        rating
    });
})


router.get('/listCourse/:id', async function (req, res) {
    const category = req.params.id;
    const listCourse = await courseModel.byCat(category);
    const catLevel2 = await categoriesLevelModel.single(category);

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
        rating,
        price,
    });
})

router.get('/search/', async function (req, res) {
    try {
        const dataSearch = req.query.dataSearch;
        const listCourse = await courseModel.fullTextSearch(dataSearch);
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
            price,
            rating
        });

    } catch (error) {
    }
})

//Adding an Course Pages
router.get('/add', function (req, res) {
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

router.get('/watchList', async function (req, res) {
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

router.post('/del', async function (req, res) {
    const ret = await courseModel.del(req.body);
})

router.post('/patch', async function (req, res) {
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