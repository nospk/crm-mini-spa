const cash_book = require('../../app/controllers/admin/cash_book');


module.exports = function (app) {
    app.get("/admin_cash_book", cash_book.loggedInadmin, cash_book.show)// render page default
    app.post("/admin_cash_book/get_data", cash_book.loggedInadmin, cash_book.get_data)
	app.post("/admin_cash_book/getStoreSupplierEmployees", cash_book.loggedInadmin, cash_book.getStoreSupplierEmployees)
}