const Controller = require('../../../core/controller');
const Store = require('../../models/store');
const Common = require("../../../core/common");
const Product_service = require('../../models/product_service');
const Store_stocks = require('../../models/store_stocks');
const bcrypt = require('bcrypt-nodejs');
class Admin_store extends Controller{
    static show(req, res){
        Admin_store.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin_store/store', {name_account: req.session.user.company.name_account});
    }
	static async get_store(req, res){
		try{
			let store = await Store.find({company: req.session.user.company._id});
			Admin_store.sendData(res, store);
		}catch(err){
			console.log(err.message)
			Admin_store.sendError(res, err, err.message);
		}
	}
	static async create_store(req, res){
		try{
			if(!Common.notEmpty(req.body.name) ||!Common.notEmpty(req.body.address) || !Common.notEmpty(req.body.username) || !Common.notEmpty(req.body.password)){
				Admin_store.sendError(res, "Lỗi thiếu thông tin", "Vui lòng nhập đầy đủ các thông tin");
				return;
			}
			let check = await Store.findOne({company: req.session.user.company._id, username: req.body.username+req.session.user.company.name_account});
			if(check){
				Admin_store.sendError(res, "Đã có tên tài khoản", "Vui lòng chọn tên tài khoản khác");
				return;
			}
			let active_code = bcrypt.hashSync(Math.floor((Math.random() * 99999999) * 54), null, null);
			let store = Store({
				name: req.body.name,
				address: req.body.address,
				phone: req.body.phone,
				company: req.session.user.company._id,
				username: req.body.username+req.session.user.company.name_account,
				password: Common.generateHash(req.body.password),
				active_code: active_code
			});
			await store.save()
			//if had products, will be create store_stocks
			let get_products = await Product_service.find({company: req.session.user.company._id, type: "product"})
			if(get_products){
				get_products.forEach(async (product) => {
					let store_stocks = Store_stocks({
						product : product._id,
						store_name: store.name,
						store_id: store._id,
						company: req.session.user.company._id,
					})
					await store_stocks.save()
					product.stocks_in_store.push(store_stocks._id)
					await product.save()
				});
			}
			Admin_store.sendMessage(res, "Đã tạo thành công");
			
		}catch(err){
			console.log(err.message)
			Admin_store.sendError(res, err, err.message);
		}
		
	}
	static async active_store(req, res){
		try{
			let store = await Store.findOne({company: req.session.user.company._id, _id: req.body.id})
			if(store != null){
				req.session.store_id = store._id;
				req.session.store_name = store.name;
				res.locals.menu = "active";
				Admin_store.sendMessage(res, "Đã active thành công");
			}else{
				Admin_store.sendError(res, "Lỗi chọn cửa hàng", "Cửa hàng không có thực");
			}
		}catch(err){
			Admin_store.sendError(res, err, err.message);
		}
		
	}
}

module.exports = Admin_store