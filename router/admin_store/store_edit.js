const  store_edit = require('../../app/controllers/admin_store/store_edit');


module.exports = function (app) {
    app.get("/admin_store_edit", store_edit.loggedInadmin, store_edit.show)// render page default
	app.post("/admin_store_edit/get_store", store_edit.loggedInadmin, store_edit.get_store)
	app.post("/admin_store_edit/change_password_store", store_edit.loggedInadmin, store_edit.change_password_store)
	app.post("/admin_store_edit/change_password_manager", store_edit.loggedInadmin, store_edit.change_password_manager)
	app.put("/admin_store_edit/update_store", store_edit.loggedInadmin, store_edit.update_store)
}