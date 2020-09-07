const  home = require('../app/controllers/login');


module.exports = function (app, passport) {
    app.get("/login", home.showLogin)// render page default
	app.get("/admin/login", home.adminShowLogin)// render page default
	app.post('/login', passport.authenticate('store-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    app.post('/admin/login', passport.authenticate('admin-login', {
        successRedirect: '/admin_store', // redirect to the secure profile section
        failureRedirect: '/admin/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
}
