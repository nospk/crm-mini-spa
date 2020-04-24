const  home1 = require('../app/controllers/homepage1');


module.exports = function (app) {
    app.get("/home1", home1.show)// render page default
}
