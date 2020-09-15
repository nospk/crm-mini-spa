const  store = require('../../app/controllers/store/store_sale');


module.exports = function (app) {
    app.get("/store_sale", store.loggedIn, store.show)// render page default
	app.post("/store_sale/search_product", store.loggedIn, store.search_product)
	app.post("/store_sale/get_service", store.loggedIn, store.get_service)
}