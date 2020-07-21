const  stocks = require('../../app/controllers/admin/stocks');


module.exports = function (app) {
    app.get("/admin_stocks", stocks.loggedInadmin, stocks.show)// render page default
    app.post("/admin_stocks/get_product", stocks.loggedInadmin, stocks.get_product)
    app.post("/admin_stocks/create", stocks.loggedInadmin, stocks.create_new)
}