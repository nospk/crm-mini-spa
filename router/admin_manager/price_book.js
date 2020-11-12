const  price_book = require('../../app/controllers/admin_manager/price_book');


module.exports = function (app) {
    app.get("/admin_price_book", price_book.loggedInadmin, price_book.show)// render page default
    app.post("/admin_price_book/create_price_book", price_book.loggedInadmin, price_book.create_price_book)
	app.put("/admin_price_book/edit_price_book", price_book.loggedInadmin, price_book.edit_price_book)
    app.post("/admin_price_book/get_data", price_book.loggedInadmin, price_book.get_data)
	app.post("/admin_price_book/get_store_groupCustomer", price_book.loggedInadmin, price_book.get_store_groupCustomer)
    app.post("/admin_price_book/save_price", price_book.loggedInadmin, price_book.save_price)
	app.post("/admin_price_book/get_price_book", price_book.loggedInadmin, price_book.get_price_book)
    app.delete("/admin_price_book/delete_data", price_book.loggedInadmin, price_book.delete_data)
}