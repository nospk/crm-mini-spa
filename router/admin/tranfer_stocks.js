const  tranfer_stocks = require('../../app/controllers/admin/tranfer_stocks');


module.exports = function (app) {
    app.get("/admin_tranfer_stocks", tranfer_stocks.loggedInadmin, tranfer_stocks.show)// render page default
    app.post("/admin_tranfer_stocks/get_data", tranfer_stocks.loggedInadmin, tranfer_stocks.get_data)

}