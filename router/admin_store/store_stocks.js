const  store_stocks = require('../../app/controllers/admin_store/store_stocks');


module.exports = function (app) {
    app.get("/admin_store_stocks", store_stocks.loggedInadmin, store_stocks.show)// render page default
	app.post("/admin_store_stocks/get_data", store_stocks.loggedInadmin, store_stocks.get_data)
	app.put("/admin_store_stocks/update_stocks", store_stocks.loggedInadmin, store_stocks.update_stocks)
	app.post("/admin_store_stocks/get_product_of_undefined", store_stocks.loggedInadmin, store_stocks.get_product_of_undefined)
}