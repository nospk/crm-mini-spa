const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Storage_stocks = require('../../models/storage_stocks');
const mongoose = require('mongoose');
class Admin_stocks extends Controller{
    static show(req, res){
        Admin_stocks.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin/store_stocks');
    }
	static async get_product(req, res){
        try{
			let data = await Product_service.find({company: req.session.user.company._id, type: "product", isActive: true, isDelete: false});
			Admin_stocks.sendData(res, data);
		}catch(err){
			console.log(err)
			Admin_stocks.sendError(res, err, err.message);
        }
    }
    static async create_new(req, res){
		try{
            let products = req.body.products;
            for (let i = 1; i < products.length; i++){
                let find_product = await Product_service.findOne({company: req.session.user.company._id, type: "product", _id: products[i].product_id})
                let cost_price_average = ((Number(find_product.stocks) * Number(find_product.cost_price)) + (Number(products[i].stock_quantity) * Number(products[i].cost_price))) / (Number(find_product.stocks) + Number(products[i].stock_quantity))
                find_product.stocks = Number(find_product.stocks) + Number(products[i].stock_quantity)
                console.log(Math.ceil(cost_price_average))
                find_product.cost_price = Math.ceil(cost_price_average)
                await find_product.save()
                await Storage_stocks.findOneAndUpdate({company: req.session.user.company._id, product: products[i].product_id},{$inc:{quantity:products[i].stock_quantity}})
            }
            Admin_stocks.sendMessage(res, "Đã tạo thành công");
		}catch(err){
			console.log(err)
			Admin_stocks.sendError(res, err, err.message);
		}
		
    }
}

module.exports = Admin_stocks