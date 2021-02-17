const  signup = require('../../app/controllers/admin_manager/signup');


module.exports = function (app, passport) {
    app.get("/signup", signup.adminshowSignup)// render page default
    app.post("/signup", passport.authenticate('local-signup', {
        successRedirect: '/signup', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
}
