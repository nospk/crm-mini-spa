const  signup = require('../app/controllers/signup');


module.exports = function (app, passport) {
    app.get("/admin/signup", signup.adminshowSignup)// render page default
    app.post("/admin/signup", passport.authenticate('local-signup', {
        successRedirect: '/admin/signup', // redirect to the secure profile section
        failureRedirect: '/admin/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
}
