const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
class Admin_product_service extends Controller{
    static show(req, res){
        Admin_product_service.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin/product_service');
    }
	// static async get_store(req, res){
	// 	try{
	// 		let store = await Store.find({'user_manager.id_admin': req.session.user._id});
	// 		Admin_store.sendData(res, store);
	// 	}catch(err){
	// 		console.log(err.message)
	// 		Admin_store.sendError(res, err, err.message);
	// 	}
	// }
	static async create_new(req, res){
		Admin_product_service.setLocalValue(req,res);
		try{
			let new_product_service = Product_service({
				name: req.body.name,
                type_product_service: req.body.type_product_service,
                price: req.body.price,
                description: req.body.description,
				user_manager: req.session.user._id
			});
			await new_product_service.save()
			Admin_product_service.sendMessage(res, "Đã tạo thành công");
		}catch(err){
			console.log(err.message)
			Admin_product_service.sendError(res, err, err.message);
		}
		
	}
	// static async active_store(req, res){
	// 	Admin_store.setLocalValue(req,res);
	// 	try{
	// 		let store = await Store.findOne({'user_manager.id_admin': req.session.user._id, _id: req.body.id})
	// 		if(store != null){
	// 			req.session.store_id = store._id;
	// 			console.log(req.session)
	// 			res.locals.menu = "active";
	// 			Admin_store.sendMessage(res, "Đã active thành công");
	// 		}else{
	// 			Admin_store.sendError(res, "Lỗi chọn cửa hàng", "Cửa hàng không có thực");
	// 		}
	// 	}catch(err){
	// 		console.log(err.message)
	// 		Admin_store.sendError(res, err, err.message);
	// 	}
		
	// }
}

module.exports = Admin_product_service