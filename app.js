const express =  require('express');
const morgan = require('morgan');
const path = require('path');
const port = process.env.PORT || 3000;
const fs = require('fs');

const app = express();
app.use(morgan('common'));

app.set('views', path.join('./app/views'));
app.listen(port);



//add one folder then put your route files there my router folder name is routers
const routePath="./router/"; 
fs.readdirSync(routePath).forEach(function(file) {
    var route=routePath+file;
    require(route)(app);
});




exports = module.exports = app;