const  transfer_stocks = require('../../app/controllers/admin/transfer_stocks');


module.exports = function (app) {
    app.get("/admin_transfer_stocks", transfer_stocks.loggedInadmin, transfer_stocks.show)// render page default
    app.post("/admin_transfer_stocks/get_data", transfer_stocks.loggedInadmin, transfer_stocks.get_data)
    app.post("/admin_transfer_stocks/getStoresAndProducts", transfer_stocks.loggedInadmin, transfer_stocks.getStoresAndProducts)
    app.post("/admin_transfer_stocks/create", transfer_stocks.loggedInadmin, transfer_stocks.create_new)
}