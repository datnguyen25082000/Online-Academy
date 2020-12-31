const authMiddleware = require('../routes/controllers/auth');

module.exports = function (app) {
    // DEFAULT
    app.use('/', require('../routes/index.route'));

    // ROUTE ĐĂNG NHẬP ĐĂNG KÍ
    app.use('/auth', require('../routes/auth.route'));

    // ROUTE THAO TÁC VỚI TỪNG TÀI KHOẢN
    app.use('/admin/', authMiddleware.adminAuthenticated, require('../routes/admin.route'));
    app.use('/categories/', require('../routes/category.route'));
    app.use('/courses/', require('../routes/course.route'));
    app.use('/users/', require('../routes/user.route'));
    app.use('/lecturer/', authMiddleware.authorAuthenticated, require('../routes/lecturer.route'));

}