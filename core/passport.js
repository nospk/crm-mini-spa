
const LocalStrategy = require('passport-local').Strategy;

const User = require('../app/models/user');
const Company = require('../app/models/company');
const bcrypt = require('bcrypt-nodejs');
const Store = require('../app/models/store');


//expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function (user, done) {
        if (!user.image_store) {
            User.findById(user._id, function (err, user) {
                done(err, user);
            });
        } else {
            Store.findById(user._id, function (err, user) {
                done(err, user);
            });
        }
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, username, password, done) {
            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {
                // find a user whose username is the same as the forms username
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'username': username + req.body.name_extension }, async function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);
                    if (!req.body.name || !req.body.name_extension) {
                        return done(null, false, req.flash('error', 'Thiếu thông tin vui lòng nhập đầy đủ'));
                    }
                    let check_company = await Company.findOne({ name_account: req.body.name_extension });
                    // check to see if theres already a user with that email
                    if (check_company) {
                        return done(null, false, req.flash('error', 'Tên công ty bị trùng - vui lòng thêm ký tự.'));
                    } else if (user) {
                        return done(null, false, req.flash('error', 'Tài khoản này đã được tạo.'));
                    } else {
                        let company = Company({
                            name: req.body.name,
                            name_account: req.body.name_extension,
                            total_user: 1,
                            isActive: true
                        })
                        await company.save()
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.password = newUser.generateHash(password);
                        newUser.name = req.body.username
                        newUser.username = req.body.username + req.body.name_extension;
                        newUser.isActive = true; //inactive for email actiavators
                        newUser.company = company._id;
                        newUser.role_id = 0;
                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser, req.flash('success',
                                `Account Created Successfully<br>
							Tài khoản quản lý: ${newUser.username}<br>
							Mật khẩu: ${password}
							`));
                        });
                    }
                });
            });
        }));


    // =========================================================================
    // ADMIN LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'admin'

    passport.use('admin-login', new LocalStrategy({
        // by default, admin strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        async function (req, username, password, done) { // callback with email and password from our form
            try {
                let user = await User.findOne({ 'username': username }).populate({
                    path: 'company',
                    select: 'name name_account',
                });
                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('error', 'Sorry Your Account Not Exits ,Please Create Account.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('error', 'Email and Password Does Not Match.')); // create the loginMessage and save it to session as flashdata
                if (user.isActive === false)
                    return done(null, false, req.flash('error', 'Your Account Not Activated ,Please Check Your Email')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                req.session.user = user;
                return done(null, user);
            } catch (err) {
                // if there are any errors, return the error before anything else
                return done(null, false, req.flash('error', err)); // req.flash is the way to set flashdata using connect-flash
            }
        }));

    // =========================================================================
    // STORE LOGIN =============================================================
    // =========================================================================	

    passport.use('store-login', new LocalStrategy({
        // by default, store strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        async function (req, username, password, done) { // callback with email and password from our form
            try {
                let store = await Store.findOne({ 'username': username })
                // if no store is found, return the message
                if (!store)
                    return done(null, false, req.flash('error', 'Tài khoản của bạn không tồn tại.')); // req.flash is the way to set flashdata using connect-flash

                // if the store is found but the password is wrong
                if (!store.validPassword(password))
                    return done(null, false, req.flash('error', 'Tài khoản hoặc Mật khẩu không đúng.')); // create the loginMessage and save it to session as flashdata
                if (store.isActive === false)
                    return done(null, false, req.flash('error', 'Tài khoản của bạn đã bị khóa hoặc chưa được kích hoạt.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful store
                req.session.store = store;
                return done(null, store);
            } catch (err) {
                // if there are any errors, return the error before anything else
                return done(null, false, req.flash('error', err)); // req.flash is the way to set flashdata using connect-flash
            }
        }));
};








