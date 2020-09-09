const  brand_group = require('../../app/controllers/admin_manager/brand_group');


module.exports = function (app) {
    app.post("/admin_brand_group/get_data", brand_group.loggedInadmin, brand_group.get_data)
	app.post("/admin_brand_group/new_brand", brand_group.loggedInadmin, brand_group.new_brand)
	app.post("/admin_brand_group/new_group", brand_group.loggedInadmin, brand_group.new_group)
}