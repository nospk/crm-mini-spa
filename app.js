require('dotenv').config();
const express =  require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session')
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const error_handler = require('./core/error_handler.js');
const app = express();

/*************************** Main *******************************/


//helmet protect express
app.use(helmet())
app.use(session({ 
    secret: 'this-is-a-secret-token', 
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//morgan log access - except type GET
app.use(morgan('common', {
    skip: function (req, res) { 
        return req.method == 'GET' 
    }
}))
require('./core/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session());
//Public file
app.use(express.static(path.join(__dirname, 'public')));

//Set dir view and view engine
app.set('views', path.join('./app/views'));
app.set('view engine', 'ejs');

// connect to our database 
mongoose.connect(process.env.DB_LOCALHOST, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });  



//add one folder then put your route files there my router folder name is routers
const routePath="./router/"; 
fs.readdirSync(routePath).forEach(function(file) {
    var route=routePath+file;
    if(file == 'login.js' || file == 'signup.js'){
        require(route)(app, passport);
    }else{
        require(route)(app, passport);
    }
    
});

//Catch not found
app.use(error_handler.notFound);
app.use(error_handler.errorHandler);

//Run server
app.listen(port);
console.log('The magic happens on port ' + port);


exports = module.exports = app;