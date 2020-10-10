const  discount = require('../../app/controllers/admin_manager/discount');


module.exports = function (app) {
    app.get("/admin_discount", discount.loggedInadmin, discount.show)// render page default
    app.post("/admin_discount/create", discount.loggedInadmin, discount.create_new)
    app.post("/admin_discount/get", discount.loggedInadmin, discount.get_data)
	app.post("/admin_discount/edit_data", discount.loggedInadmin, discount.edit_data)
	app.put("/admin_discount/update_data", discount.loggedInadmin, discount.update_data)
    app.delete("/admin_discount/delete_data", discount.loggedInadmin, discount.delete_data)
}