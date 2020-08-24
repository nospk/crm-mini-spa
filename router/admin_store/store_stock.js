const  store_stock = require('../../app/controllers/admin_store/store_stock');


module.exports = function (app) {
    app.get("/admin_store_stock", store_stock.loggedInadmin, store_stock.show)// render page default
	app.post("/admin_store_stock/get_data", store_stock.loggedInadmin, store_stock.get_data)
	app.post("/admin_store_stock/update_stock", store_stock.loggedInadmin, store_stock.update_stock)
}