const  product_service = require('../../app/controllers/admin/product_service');


module.exports = function (app) {
    app.get("/admin_product_service", product_service.loggedInadmin, product_service.show)// render page default
    app.post("/admin_product_service/create", product_service.loggedInadmin, product_service.create_new)

}