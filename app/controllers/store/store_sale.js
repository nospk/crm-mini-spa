const Controller = require('../../../core/controller');
const Store = require('../../models/store');
const Common = require("../../../core/common");
const Product_service = require('../../models/product_service');
const Store_stocks = require('../../models/store_stocks');
class Store_sale extends Controller{
    static show(req, res){
        Store_sale.setLocalValue(req,res);
        res.render('./pages/store/store_sale');
    }
}

module.exports = Store_sale