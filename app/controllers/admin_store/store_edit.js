const Controller = require('../../../core/controller');
const Store = require('../../models/store');
const Common = require("../../../core/common");
const bcrypt = require('bcrypt-nodejs');
class Admin_store_edit extends Controller{
    static show(req, res){
        Admin_store_edit.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin_store/store_edit');
    }
	static async get_store(req, res){
		try{
			let store = await Store.findOne({company: req.session.user.company._id, _id: req.session.store_id});
			Admin_store_edit.sendData(res, store);
		}catch(err){
			console.log(err.message)
			Admin_store_edit.sendError(res, err, err.message);
		}
	}
	static async update_store(req, res){
		try{
			let store = await Store.findOneAndUpdate({company: req.session.user.company._id, _id: req.session.store_id},{$set:{name:req.body.name, address:req.body.address, phone: req.body.phone}},{new: true})
			req.session.store_name = store.name;
			Admin_store_edit.sendMessage(res, "Đã cập nhật thành công");
		}catch(err){
			console.log(err.message)
			Admin_store_edit.sendError(res, err, err.message);
		}
		
	}
	static async change_password_store(req,res){
		try{
			let store = await Store.findOne({company: req.session.user.company._id, _id: req.session.store_id})
            store.password = Common.generateHash(req.body.password);
			await store.save();
			Admin_store_edit.sendMessage(res, "Đã cập nhật thành công");
		}catch(err){
			console.log(err.message)
			Admin_store_edit.sendError(res, err, err.message);
		}
	}
	static async change_password_manager(req,res){
		try{
			let store = await Store.findOne({company: req.session.user.company._id, _id: req.session.store_id})
            store.password_manager = Common.generateHash(req.body.password);
			await store.save();
			Admin_store_edit.sendMessage(res, "Đã cập nhật thành công");
		}catch(err){
			console.log(err.message)
			Admin_store_edit.sendError(res, err, err.message);
		}
	}
}

module.exports = Admin_store_edit