const  store = require('../../app/controllers/store/store_sale');


module.exports = function (app) {
    app.get("/store_sale", store.loggedIn, store.show)// render page default
	app.post("/store_sale/search_product", store.loggedIn, store.search_product)
	app.post("/store_sale/search_customer", store.loggedIn, store.search_customer)
	app.post("/store_sale/search_discount", store.loggedIn, store.search_discount)
	app.post("/store_sale/create_customer", store.loggedIn, store.create_customer)
	app.post("/store_sale/get_service", store.loggedIn, store.get_service)
	app.post("/store_sale/get_employees", store.loggedIn, store.get_employees)
}