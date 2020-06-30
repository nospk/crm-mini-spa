const  admin_store = require('../../app/controllers/admin/admin_store');


module.exports = function (app) {
    app.get("/admin_store", admin_store.loggedInadmin, admin_store.show)// render page default
	app.post("/admin_store/create", admin_store.loggedInadmin, admin_store.create_store)
	app.post("/admin_store/get", admin_store.loggedInadmin, admin_store.get_store)
	app.post("/admin_store/active", admin_store.loggedInadmin, admin_store.active_store)
}