const  supplier = require('../../app/controllers/admin_manager/supplier');


module.exports = function (app) {
    app.get("/admin_supplier", supplier.loggedInadmin, supplier.show)// render page default
    app.post("/admin_supplier/create", supplier.loggedInadmin, supplier.create_new)
    app.post("/admin_supplier/get", supplier.loggedInadmin, supplier.get_data)
	app.post("/admin_supplier/edit_data", supplier.loggedInadmin, supplier.edit_data)
	app.put("/admin_supplier/update_data", supplier.loggedInadmin, supplier.update_data)
    //app.delete("/admin_employees/delete_data", employees.loggedInadmin, employees.delete_data)
}