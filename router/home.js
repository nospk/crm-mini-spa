const  home = require('../app/controller/homepage');


module.exports = function (app) {
    app.get("/", home.show)// render page default
}
