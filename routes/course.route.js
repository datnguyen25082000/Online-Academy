const express = require("express");
const courseModel = require("../models/course.model");
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
