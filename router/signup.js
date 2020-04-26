const  signup = require('../app/controllers/signup');


module.exports = function (app, passport) {
    app.get("/signup", signup.showSignup)// render page default
    app.post("/signup", passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
}
