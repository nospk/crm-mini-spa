const  customer = require('../../app/controllers/admin_manager/customer');


module.exports = function (app) {
    app.get("/admin_customer", customer.loggedInadmin, customer.show)// render page default
    app.post("/admin_customer/create", customer.loggedInadmin, customer.create_new)
    app.post("/admin_customer/get", customer.loggedInadmin, customer.get_data)
	app.post("/admin_customer/edit_data", customer.loggedInadmin, customer.edit_data)
	app.put("/admin_customer/update_data", customer.loggedInadmin, customer.update_data)
    
}