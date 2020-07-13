const Controller = require('../../../core/controller');
const Store = require('../../models/store');
class Admin_store extends Controller{
    static show(req, res){
        Admin_store.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin/store');
    }
	static async get_store(req, res){
		try{
			let store = await Store.find({'user_manager.id_admin': req.session.user._id});
			Admin_store.sendData(res, store);
		}catch(err){
			console.log(err.message)
			Admin_store.sendError(res, err, err.message);
		}
	}
	static async create_store(req, res){
		try{
			let store = Store({
				name: req.body.name,
				address: req.body.address,
				user_manager: {
					id_admin: req.session.user._id
				},
			});
			await store.save()
			Admin_store.sendMessage(res, "Đã tạo thành công");
		}catch(err){
			console.log(err.message)
			Admin_store.sendError(res, err, err.message);
		}
		
	}
	static async active_store(req, res){
		try{
			let store = await Store.findOne({'user_manager.id_admin': req.session.user._id, _id: req.body.id})
			if(store != null){
				req.session.store_id = store._id;
				console.log(req.session)
				res.locals.menu = "active";
				Admin_store.sendMessage(res, "Đã active thành công");
			}else{
				Admin_store.sendError(res, "Lỗi chọn cửa hàng", "Cửa hàng không có thực");
			}
		}catch(err){
			console.log(err.message)
			Admin_store.sendError(res, err, err.message);
		}
		
	}
}

module.exports = Admin_store