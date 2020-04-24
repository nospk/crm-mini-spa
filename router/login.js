const  home = require('../app/controllers/login');


module.exports = function (app) {
    app.get("/", home.showLogin)// render page default
}
