const  price_book = require('../../app/controllers/admin_manager/price_book');


module.exports = function (app) {
    app.get("/admin_price_book", price_book.loggedInadmin, price_book.show)// render page default
    app.post("/admin_price_book/create", price_book.loggedInadmin, price_book.create_new)
    app.post("/admin_price_book/get", price_book.loggedInadmin, price_book.get_data)
	app.post("/admin_price_book/get_store_groupCustomer", price_book.loggedInadmin, price_book.get_store_groupCustomer)
    app.post("/admin_price_book/save_price_default", price_book.loggedInadmin, price_book.save_price_default)
	app.post("/admin_price_book/edit_data", price_book.loggedInadmin, price_book.edit_data)
	app.put("/admin_price_book/update_data", price_book.loggedInadmin, price_book.update_data)
    app.delete("/admin_price_book/delete_data", price_book.loggedInadmin, price_book.delete_data)
}