const  employees = require('../../app/controllers/admin_manager/employees');


module.exports = function (app) {
    app.get("/admin_employees", employees.loggedInadmin, employees.show)// render page default
    app.post("/admin_employees/create", employees.loggedInadmin, employees.create_new)
    app.post("/admin_employees/get", employees.loggedInadmin, employees.get_data)
	app.post("/admin_employees/get_store", employees.loggedInadmin, employees.get_store)
	app.post("/admin_employees/edit_data", employees.loggedInadmin, employees.edit_data)
	app.put("/admin_employees/update_data", employees.loggedInadmin, employees.update_data)
    app.delete("/admin_employees/delete_data", employees.loggedInadmin, employees.delete_data)
}