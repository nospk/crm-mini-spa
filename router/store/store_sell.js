const  store = require('../../app/controllers/store/store_sell');


module.exports = function (app) {
	app.get("/", store.loggedIn, store.show)// render page default
	app.post("/invoice_sells", store.loggedIn, store.get_invoice_sell)
	app.get("/invoice_sells/:id", store.loggedIn, store.get_invoice_sell_id)
	app.post("/print_bill", store.loggedIn, store.print_bill)
	app.post("/search_product", store.loggedIn, store.search_product)
	app.post("/search_customer", store.loggedIn, store.search_customer)
	app.post("/search_discount", store.loggedIn, store.search_discount)
	app.post("/create_customer", store.loggedIn, store.create_customer)
	app.post("/get_price_book", store.loggedIn, store.get_price_book)
	app.post("/get_customer", store.loggedIn, store.get_customer)
	app.post("/use_service", store.loggedIn, store.use_service)
	app.post("/check_password_manager", store.loggedIn, store.check_password_manager)
	app.post("/report", store.loggedIn, store.report)
	app.post("/get_by_id", store.loggedIn, store.get_by_id)
	app.post("/get_service", store.loggedIn, store.get_service)
	app.post("/check_out", store.loggedIn, store.check_out)
	//app.post("/update_bill", store.loggedIn, store.update_bill)
	app.delete("/delete_bill", store.loggedIn, store.delete_bill)
	app.post("/get_employees", store.loggedIn, store.get_employees)
}