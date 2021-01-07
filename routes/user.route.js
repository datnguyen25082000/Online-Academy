const express = require("express");

const router = express.Router();

const { ensureAuthenticated, forwardAuthenticated, typeAuthenticated, userAuthenticated } = require("./controllers/auth");
const UserModel = require("../models/user.model");
const registedCourseModel = require("../models/registedCourse.model");
const watchListModel = require("../models/watchList.model");
const multer = require("multer");
const reviewModel = require("../models/review.model");

router.get("/", async function (req, res) {
  const rows = await UserModel.all();
  res.render("vwUsers/index", {
    users: rows,
    empty: rows.length === 0,
  });
});

router.get("/add", function (req, res) {
  res.render("vwUsers/add");
});

router.post("/add", async function (req, res) {
  const ret = await UserModel.add(req.body);
});

router.post("/del", async function (req, res) {
  const ret = await UserModel.del(req.body);
});

router.post("/patch", async function (req, res) {
  const ret = await UserModel.patch(req.body);
  res.redirect("/users");
});

//send comment
router.post("/sendComment", async function (req, res) {
  let data = {
    username: req.session.passport.user.userUsername,
    courseID: req.body.courseID,
    content: req.body.content,
    vote: req.body.vote,
    dateReview: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };

  console.log(data);

  const ret = await reviewModel.add(data);

  res.redirect(`/courses/${data.courseID}`);
});

//register a course
router.post("/registerCourse", async function (req, res) {
  let data = {
    username: req.session.passport.user.userUsername,
    courseID: req.body.courseID,
  };
  const ret = await registedCourseModel.add(data);

  res.redirect(`/courses/${data.courseID}`);
});

//add a course to watch list
router.post("/addFavorite", async function (req, res) {
  let data = {
    username: req.session.passport.user.userUsername,
    courseID: req.body.courseID,
  };
  const ret = await watchListModel.add(data);

  res.redirect(`/courses/${data.courseID}`);
});

//remove a course from watch list
router.post("/removeFavorite", async function (req, res) {
  let data = {
    username: req.session.passport.user.userUsername,
    courseID: +req.body.courseID,
  };
  const ret = await watchListModel.del(data);

  res.redirect("/courses/watchList");
});

// Profile
router.get("/profile", async function (req, res) {
  const info = await UserModel.single(req.session.passport.user.userUsername);

  if (info === null) {
    return res.redirect("/");
  }
  let tab = req.query.tab;
  if (tab == null) {
    tab = "general";
  }

  res.render("vwUsers/profile", {
    info: info,
    isGeneralTab: tab == "general",
  });
});

// save avatar
router.post("/profile", function (req, res) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });
  // upload.single('fuMain')(req, res, function (err) {

  upload.array("fuMain", 3)(req, res, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("vwUsers/profile");
    }
  });
});

//save info
router.post("/profile/save", async function (req, res) {
  console.log(req.body);
  const ret = await UserModel.patch(req.body);
  res.redirect("/users/profile");
});

router.get("/:id", async function (req, res) {
  const id = req.params.id;
  const user = await UserModel.single(id);
  if (user === null) {
    return res.redirect("/users");
  }
  res.render("vwUsers/edit", {
    editUser: user,
  });
});

module.exports = router;
