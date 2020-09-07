const  base = require('../app/controllers/base');


module.exports = function (app) {
    app.get("/", base.loggedIn, base.show)// render page default
    app.get("/logout", base.logout)
	app.get("/admin/logout", base.adminlogout)
}
