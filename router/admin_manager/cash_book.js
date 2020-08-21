const cash_book = require('../../app/controllers/admin_manager/cash_book');


module.exports = function (app) {
    app.get("/admin_cash_book", cash_book.loggedInadmin, cash_book.show)// render page default
    app.post("/admin_cash_book/get_data", cash_book.loggedInadmin, cash_book.get_data)
	app.post("/admin_cash_book/getStoreSupplierCustomerEmployees", cash_book.loggedInadmin, cash_book.getStoreSupplierCustomerEmployees)
	app.post("/admin_cash_book/create", cash_book.loggedInadmin, cash_book.create_new)
}