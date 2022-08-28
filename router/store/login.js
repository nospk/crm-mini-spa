const  home = require('../../app/controllers/store/login');


module.exports = function (app, passport) {
    app.get("/login", home.showLogin)// render page default
	app.post('/login', passport.authenticate('store-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true, // allow flash messages
        keepSessionInfo: true
    }));
	app.get("/logout", home.logout)
}