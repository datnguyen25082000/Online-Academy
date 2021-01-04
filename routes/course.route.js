const express = require('express');
const courseModel = require('../models/course.model');
const multer = require('multer');

const router = express.Router();

router.get('/', async function(req, res) {
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

//Adding an Course Pages
router.get('/add', function(req, res) {
    res.render('vwCourses/add');

})

//Adding an Course 
router.post('/add', function(req, res) {

    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/imagesCourse')
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname)
        }
    });

    var upload = multer({ storage: storage }).single('avatar-2');
    upload(req, res, function(err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
        } else {
            const { courseName, short_des, full_des, price, discount, lesson } = req.body;
            let errors = [];

            if (!courseName || !short_des || !full_des || !price) {
                errors.push({ msg: 'Please enter all fields' });
            }

            console.log(req.body);
            console.log(courseName);
            console.log(short_des);
            console.log(full_des);
            console.log(price);
            console.log(discount);

            if (!(lesson === undefined)) {
                for (i = 0; i < lesson.length; i++) {
                    console.log(lesson[i]);
                }
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
            res.render('vwCourses/add')
        }
    });

})

router.post('/del', async function(req, res) {
    const ret = await courseModel.del(req.body);
})

router.post('/patch', async function(req, res) {
    const ret = await courseModel.patch(req.body);
    res.redirect('/courses');
})

router.get('/:id', async function(req, res) {
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