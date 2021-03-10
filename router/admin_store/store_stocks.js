const  store_stocks = require('../../app/controllers/admin_store/store_stocks');


module.exports = function (app) {
    app.get("/admin_store_stocks", store_stocks.loggedInadmin, store_stocks.show)// render page default
	app.post("/admin_store_stocks/get_data", store_stocks.loggedInadmin, store_stocks.get_data)
	app.post("/admin_store_stocks/products/:id", store_stocks.loggedInadmin, store_stocks.get_storeStocks_productId)
	app.put("/admin_store_stocks/set_stocks_classify", store_stocks.loggedInadmin, store_stocks.set_stocks_classify)
	app.post("/admin_store_stocks/check_stocks", store_stocks.loggedInadmin, store_stocks.check_stocks)
	app.post("/admin_store_stocks/get_product", store_stocks.loggedInadmin, store_stocks.get_product)
	app.post("/admin_store_stocks/get_product_of_undefined", store_stocks.loggedInadmin, store_stocks.get_product_of_undefined)
}