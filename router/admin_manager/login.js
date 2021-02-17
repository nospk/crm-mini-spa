const  home = require('../../app/controllers/admin_manager/login');


module.exports = function (app, passport) {
	app.get("/", home.loggedInadmin, home.show)
	app.get("/login", home.adminShowLogin)// render page default
    app.post('/login', passport.authenticate('admin-login', {
        successRedirect: '/admin_store', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
	app.get("/logout", home.adminlogout)
}
