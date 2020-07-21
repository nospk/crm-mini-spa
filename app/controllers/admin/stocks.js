const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Stocks = require('../../models/stocks');
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
            console.log(products)
            let reduce_products = new Array(products).map((item)=>{ //remove number_code
                delete item.number_code; 
                return item; 
            });
            console.log(products)
            let save_socks = Stocks({
                serial: 'QLNH1',
                type: 'import',
                admin_id: req.session.user._id,
                list_products: reduce_products
            })
            console.log(products)
            let id_sock= await save_socks.save();
            for (let i = 1; i < products.length; i++){
                let find = await Product_service.findOne({admin_id: req.session.user._id, type: "product", number_code: products[i].number_code})
                let cost_price_average = ((Number(find.stocks) * Number(find.cost_price)) + (Number(products[i].stock_quantity) * Number(products[i].cost_price))) / (Number(find.stocks) + Number(products[i].stock_quantity))
                find.stocks = Number(find.stocks) + Number(products[i].stock_quantity)
                find.cost_price = cost_price_average
                find.store_house = Number(find.store_house) + Number(products[i].stock_quantity)
                if(find.last_history.length >= 10){
                    find.last_history.shift()
                    find.last_history.push(id_sock._id)
                }else{
                    find.last_history.push(id_sock._id)
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