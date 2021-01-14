const express = require("express");
const courseModel = require("../models/course.model");
const learnModel = require("../models/learn.model");
const lessonModel = require("../models/lesson.model");
const registedCourseModel = require("../models/registedCourse.model");
const watchListModel = require("../models/watchList.model");
const { route } = require("./user.route");

const router = express.Router();

router.get("/", async function (req, res) {
  try {
    const rows = await courseModel.all();
    res.render("vwCourses/index", {
      courses: rows,
      empty: rows.length === 0,
    });
  } catch (err) {
    res.send("View error log at server console.");
  }
});

router.get("/add", function (req, res) {
  res.render("vwCourses/add");
});

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

router.get("/watchList", async function (req, res) {
  const rows = await watchListModel.byUsername(
    req.session.passport.user.userUsername
  );

  res.render("vwCourses/watchList", {
    courses: rows,
    empty: rows.length === 0,
  });
});

router.post("/add", async function (req, res) {
  const ret = await courseModel.add(req.body);
});

router.post("/del", async function (req, res) {
  const ret = await courseModel.del(req.body);
});

router.post("/patch", async function (req, res) {
  const ret = await courseModel.patch(req.body);
  res.redirect("/courses");
});

//learn
router.get("/learn", async function (req, res) {
  let id = +req.query.courseID;
  const lessons = await lessonModel.byCourse(id);
  const learns = await learnModel.byUsernameAndCourseID(req.session.passport.user.userUsername, id);
  console.log(learns);

  let lesson = +req.query.lessonID || 1;
  let unit = +req.query.unit || 1;

  for (let i = 0; i < lessons.length; i++)
  {
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

router.get("/:id", async function (req, res) {
  const id = req.params.id;
  let favorite = null;
  let registed = null;
  const course = await courseModel.single(id);
  let rows = await courseModel.all();

  if (req.session.passport != undefined) {
      favorite = await watchListModel.single(req.session.passport.user.userUsername,id);
    registed = await registedCourseModel.single(req.session.passport.user.userUsername,id);
    
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
