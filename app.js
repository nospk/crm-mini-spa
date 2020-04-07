require('dotenv').config();
const express =  require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const passport = require('passport');
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const error_handler = require('./core/error_handler.js')
app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('common'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join('./app/views'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.DB_LOCALHOST, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }); // connect to our database  



//add one folder then put your route files there my router folder name is routers
const routePath="./router/"; 
fs.readdirSync(routePath).forEach(function(file) {
    var route=routePath+file;
    require(route)(app);
});

//Catch not found
app.use(error_handler.notFound);
app.use(error_handler.errorHandler);

app.listen(port);
console.log('The magic happens on port ' + port);


exports = module.exports = app;