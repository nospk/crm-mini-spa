const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Store = require('../../models/store');
const mongoose = require('mongoose');
class Admin_stocks extends Controller{
    static show(req, res){
        Admin_stocks.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin/stocks');
    }
	static async get_product(req, res){
        try{
			let data = await Product_service.find({admin_id: req.session.user._id, type: "product", isActive: true, isDelete: false});
			Admin_stocks.sendData(res, data);
		}catch(err){
			console.log(err)
			Admin_stocks.sendError(res, err, err.message);
        }
    }
}

module.exports = Admin_stocks