const  store = require('../../app/controllers/admin/store');


module.exports = function (app) {
    app.get("/admin_store", store.loggedInadmin, store.show)// render page default
	app.post("/admin_store/create", store.loggedInadmin, store.create_store)
	app.post("/admin_store/get", store.loggedInadmin, store.get_store)
	app.post("/admin_store/active", store.loggedInadmin, store.active_store)
}