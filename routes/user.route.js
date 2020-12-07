const express = require('express');
const userModel = require('../models/user.model');
const router = express.Router();

router.get('/', async function (req, res) {
    // KIỂM TRA ĐĂNG NHẬP
    // RENDER TRANG THÔNG TIN CÁ NHÂN
})

router.post('/', async function (req, res) {
    console.log(req.body.username + " " + req.body.password);
    res.redirect('/');
})

router.get('/information', async function (req, res) {
    // KIỂM TRA ĐĂNG NHẬP
    // RENDER TRANG UDATE THÔNG TIN CHO USER
})


module.exports = router;