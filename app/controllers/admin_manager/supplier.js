const Controller = require('../../../core/controller');
const Supplier = require('../../models/supplier');
const mongoose = require('mongoose');
class Admin_supplier extends Controller{
    static show(req, res){
        Admin_supplier.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin_manager/supplier');
    }
	static async create_new(req, res){
		try{
			let new_supplier = Supplier({
				name: req.body.name,
				address: req.body.address,
				phone: req.body.phone,
				email: req.body.email,
				company: req.session.user.company._id
			});
			await new_supplier.save()
			Admin_supplier.sendMessage(res, "Đã tạo thành công");
		}catch(err){
			console.log(err.message)
			Admin_supplier.sendError(res, err, err.message);
		}
		
	}
	static async get_data(req, res){
		try{
			let {search}=req.body
			let match = {
				$and: [ {company : mongoose.Types.ObjectId(req.session.user.company._id), isActive: true} ] 
			}
			if(search){
				match.$and.push({'name': {$regex: search,$options:"i"}})
			}
			//set default variables
			let pageSize = 10
			let currentPage = req.body.paging_num || 1
	
			// find total item
			let pages = await Supplier.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Supplier.aggregate([{$match:match},{$skip:(pageSize * currentPage) - pageSize},{$limit:pageSize}])
			Admin_supplier.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err.message)
			Admin_supplier.sendError(res, err, err.message);
		}
	}
	static async edit_data(req, res){
		try{
			let data = await Supplier.findOne({company: req.session.user.company._id, _id: req.body.id});
			Admin_supplier.sendData(res, data);
		}catch(err){
			console.log(err.message)
			Admin_supplier.sendError(res, err, err.message);
		}
	}
	static async update_data(req, res){
		try{
			let find = await Supplier.findOne({company: req.session.user.company._id, _id: req.body.id});
			if(find){
				find.name = req.body.name;
				find.address = req.body.address;
				find.phone = req.body.phone;
				find.email = req.body.email;
				await find.save();
				Admin_supplier.sendMessage(res, "Đã thay đổi thành công");
			}else{
				Admin_supplier.sendError(res, "Không tìm thấy nhà cung cấp", "Vui lòng thử lại");
			}
		}catch(err){
			console.log(err.message)
			Admin_supplier.sendError(res, err, err.message);
		}
		
	}
	static async delete_data(req, res){
		try{
			await Supplier.findOneAndUpdate({company: req.session.user.company._id, _id: req.body.id}, {isActive: false});
			Admin_supplier.sendMessage(res, "Đã xóa thành công");
		}catch(err){
			console.log(err)
			Admin_supplier.sendError(res, err, err.message);
		}
	}
}

module.exports = Admin_supplier