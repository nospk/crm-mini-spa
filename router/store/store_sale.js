const  store = require('../../app/controllers/store/store_sale');


module.exports = function (app) {
    app.get("/store_sale", store.loggedIn, store.show)// render page default
}