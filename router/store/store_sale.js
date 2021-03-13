const  store = require('../../app/controllers/store/store_sale');


module.exports = function (app) {
	app.get("/", store.loggedIn, store.show)// render page default
	app.post("/invoice_sales", store.loggedIn, store.get_invoice_sale)
	app.get("/invoice_sales/:id", store.loggedIn, store.get_invoice_sale_id)
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
	app.post("/get_employees", store.loggedIn, store.get_employees)
}