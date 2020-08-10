const  storage_stocks = require('../../app/controllers/admin/storage_stocks');


module.exports = function (app) {
    app.get("/admin_storage_stocks", storage_stocks.loggedInadmin, storage_stocks.show)// render page default
    app.post("/admin_storage_stocks/get_product", storage_stocks.loggedInadmin, storage_stocks.get_product)
    app.post("/admin_storage_stocks/get_data", storage_stocks.loggedInadmin, storage_stocks.get_data)
    app.post("/admin_storage_stocks/create", storage_stocks.loggedInadmin, storage_stocks.create_new)
}