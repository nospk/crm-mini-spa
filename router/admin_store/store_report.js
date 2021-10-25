const  store_report = require('../../app/controllers/admin_store/store_report');


module.exports = function (app) {
    app.get("/admin_store_report", store_report.loggedInadmin, store_report.show)// render page default
    app.post("/admin_store_report/get_data", store_report.loggedInadmin, store_report.get_data)// render page default
}