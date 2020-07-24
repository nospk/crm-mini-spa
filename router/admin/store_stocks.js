const  store_stocks = require('../../app/controllers/admin/store_stocks');


module.exports = function (app) {
    app.get("/admin_store_stocks", store_stocks.loggedInadmin, store_stocks.show)// render page default
    app.post("/admin_store_stocks/get_product", store_stocks.loggedInadmin, store_stocks.get_product)
    app.post("/admin_store_stocks/get_data", store_stocks.loggedInadmin, store_stocks.get_data)
    app.post("/admin_store_stocks/create", store_stocks.loggedInadmin, store_stocks.create_new)
}