require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const port = 3600;
const error_handler = require('./core/error_handler.js');
const app = express();
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const LokiStore = require('connect-loki')(session);
const options = {
    useNewUrlParser: true,
    autoIndex: true,
    useUnifiedTopology: true
}
/*************************** Main *******************************/


//helmet protect express
app.use(helmet())
if (process.env.NODE_ENV === 'production') {
	app.use(session({
		secret: 'this-is-a-secret-token-a-b-2-3-4',
		cookie: {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 28800000
		},
		resave: false,
		saveUninitialized: true,
		store: new LokiStore({}),
	}));
} else {
	app.use(session({
		secret: 'this-is-a-secret-token-a-b-2-3-4',
		cookie: {
			maxAge: 28800000
		},
		resave: false,
		saveUninitialized: true,
		store: new LokiStore({}),
	}));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//morgan log access - except type GET
// app.use(morgan('common', {
// skip: function (req, res) { 
// return req.method == 'GET' 
// }
// }))
require('./core/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Public file
app.use(express.static(path.join(__dirname, 'public')));

//Set dir view and view engine
app.set('views', path.join('./app/views'));
app.set('view engine', 'ejs');

// connect to our database 
mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_MONGO, options);
//mongoose.connect(process.env.DB_LOCALHOST, options);  

app.use(cookieParser());
if (process.env.NODE_ENV === 'production') {
	app.set('trust proxy', 1);
	app.use(csrf({ cookie: {httpOnly: true, secure: true, sameSite: 'lax'}}));
} else {
	app.use(csrf({ cookie: true}));
}
app.use(function (req, res, next) {
    let token = req.csrfToken();
	var allowedOrigins = ['https://admin.nospk.dev'];
	var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    res.locals.csrfToken = token;
    next();
});

//add one folder then put your route files there my router folder name is routers
/* const routeBasePath = "./router/";
fs.readdirSync(routeBasePath).forEach(function (file) {
    let route = routeBasePath + file;
    if (fs.lstatSync(route).isFile()) {
        require(route)(app);
    }
}); */

    const routeAdminManagerPath = "./router/admin_manager/";
    fs.readdirSync(routeAdminManagerPath).forEach(function (file) {
        let route = routeAdminManagerPath + file;
        if (file == 'login.js' || file == 'signup.js') {
            require(route)(app, passport);
        } else {
            require(route)(app);
        }
    });
    const routeAdminStorePath = "./router/admin_store/";
    fs.readdirSync(routeAdminStorePath).forEach(function (file) {
        let route = routeAdminStorePath + file;
        require(route)(app);
    });



//Catch not found
app.use(error_handler.notFound);
app.use(error_handler.errorHandler);

//Run server
app.listen(port);
console.log('The magic happens on port ' + port);


exports = module.exports = app;
