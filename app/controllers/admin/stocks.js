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
    static async create_new(req, res){
		try{
            let products = req.body.products;
            for (let i = 1; i < products.length; i++){
                let find = await Product_service.findOne({admin_id: req.session.user._id, type: "product", number_code: products[i].number_code})
                let cost_price_average = ((Number(find.stocks) * Number(find.cost_price)) + (Number(products[i].stock_amount) * Number(products[i].cost_price))) / (Number(find.stocks) + Number(products[i].stock_amount))
                find.stocks = Number(find.stocks) + Number(products[i].stock_amount)
                find.cost_price = cost_price_average
                for (let j = 0; j < find.stocks_in.length; j ++){
                    if(find.stocks_in[j].store == req.session.store_id){
                        find.stocks_in[j].stock_amount = Number(find.stocks_in[j].stock_amount) + Number(products[i].stock_amount)
                    }
                }
                await find.save()
            }
            Admin_stocks.sendMessage(res, "Đã tạo thành công");
		}catch(err){
			console.log(err)
			Admin_stocks.sendError(res, err, err.message);
		}
		
	}
}

module.exports = Admin_stocks