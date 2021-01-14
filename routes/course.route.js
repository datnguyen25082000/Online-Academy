const express = require('express');
const courseModel = require('../models/course.model');
const multer = require('multer');
const lessonsModel = require('../models/lessons.model');
var mkdirp = require('mkdirp');
const { route } = require('./lecturer.route');


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

//Adding an Course-- get
router.get('/add', function(req, res) {
    res.render('vwCourses/add');

})

//Adding an Course -- post
router.post('/add', async function(req, res) {
    let errors = [];
    let thiscourseID = await courseModel.chooseID();
    var courseID = Object.values(JSON.parse(JSON.stringify(thiscourseID)));
    courseID = parseInt(courseID) + 1;



    var filename = "course-img";

    var des_save = "/public/imagesCourse/" + courseID + "/";
    var des_file = "." + des_save;
    console.log(des_file);

    mkdirp(des_file, function(err) {

    });

    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, des_file)
        },
        filename: function(req, file, cb) {
            //filename = file.originalname;
            cb(null, filename + ".png")
        }
    });

    var upload = multer({ storage: storage }).single('avatar-2');
    upload(req, res, async function(err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
        } else {
            const { courseName, short_des, full_des, price, discount, lesson } = req.body;


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
                await courseModel.single(courseName).then(course => {
                    if (course) {
                        errors.push({ msg: 'Course already exists' });
                        res.render('vwCourses/add', {
                            err: true,
                            errorMsg: errors[0].msg
                        });
                    } else {
                        const date = new Date().toISOString().slice(0,9).replace('T',' ');
                        courseModel.add({
                            courseID: courseID,
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
router.get('/upload_course/:courseID', async function(req, res) {
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
router.post('/upload_course/:courseID/:lessonID', async function(req, res) {

    var filename = "";
    const courseID = req.params.courseID;
    const lessonID = req.params.lessonID;
    console.log(courseID);
    console.log(lessonID);

    var des_save = "/public/imagesCourse/" + courseID + "/" + lessonID + "/";

    var des_file = "." + des_save;
    console.log(des_file);

    mkdirp(des_file, function(err) {

    });


    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, des_file)
        },
        filename: function(req, file, cb) {
            filename = file.originalname;
            cb(null, file.originalname)
        }
    });
    const upload = multer({ storage: storage });
    upload.array('dom_' + lessonID, 2)(req, res, async function(err) {
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
router.get('/edit_course/:courseID', async function(req, res){
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
router.post('/edit_course/:courseID', async function(req, res){
    let errors = [];
    const courseID = req.params.courseID;

    console.log('thsi is debug');

    var filename = "course-img";

    var des_save = "/public/imagesCourse/" + courseID + "/";
    var des_file = "." + des_save;
    console.log(des_file);

    mkdirp(des_file, function(err) {

    });

    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, des_file)
        },
        filename: function(req, file, cb) {
            cb(null, filename+".png");
        }
    });

    var upload = multer({ storage: storage }).single('avatar-2');
    upload(req, res, async function(err) {
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


//Adding an lesson name ----chua can thiet
router.post('/add_lesson/:courseID', async function(req, res)
{
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