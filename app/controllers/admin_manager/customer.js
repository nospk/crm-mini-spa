const Controller = require('../../../core/controller');
const Customer = require('../../models/customer');
const mongoose = require('mongoose');
const Invoice_sell = require('../../models/invoice_sell');
const Log_service = require('../../models/log_service');
const Invoice_service = require('../../models/invoice_service');
const Common = require("../../../core/common");
class Admin_customer extends Controller{
    static show(req, res){
        Admin_customer.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin_manager/customer');
    }
	static async create_new(req, res){
		try{
			let check = await Customer.findOne({company: req.session.user.company._id, phone:req.body.phone});
			if(check){
				return Admin_customer.sendError(res, "Số điện thoại đã có người dùng", "Vui lòng xem lại thông tin đã nhập");
			}else{
				let new_customer = Customer({
					name: req.body.name,
					query_name: await Common.removeVietnameseTones(req.body.name),
					birthday: req.body.birthday,
					gener: req.body.gener,
					address: req.body.address,
					note: req.body.note,
					phone: req.body.phone,
					company: req.session.user.company._id
				});
				await new_customer.save()
				Admin_customer.sendMessage(res, "Đã tạo thành công");
			}
		}catch(err){
			console.log(err.message)
			Admin_customer.sendError(res, err, err.message);
		}
		
	}
	static async get_data(req, res){
		try{
			let {search}=req.body
			let match = {
				$and: [ {company : mongoose.Types.ObjectId(req.session.user.company._id)} ] 
			}
			if(search){
				search = await Common.removeVietnameseTones(search) 
				match.$and.push({$or:[{'number_code': {$regex: search,$options:"i"}},{'query_name': {$regex: search,$options:"i"}}]})
			}
			//set default variables
			let pageSize = 10
			let currentPage = req.body.paging_num || 1
	
			// find total item
			let pages = await Customer.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Customer.aggregate([{$match:match},{$skip:(pageSize * currentPage) - pageSize},{$limit:pageSize}])
			Admin_customer.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err.message)
			Admin_customer.sendError(res, err, err.message);
		}
	}
	static async edit_data(req, res){
		try{
			let customer = await Customer.findOne({company: req.session.user.company._id, _id: req.body.id});
			let history_sell = await Invoice_sell.find({company: req.session.user.company._id, customer:req.body.id, isActive: true}).sort({createdAt: -1}).limit(20).populate({
				path: 'list_item.id',
				select:'name number_code'
			}).populate({
				path: 'employees',
				select:'name'
			}).populate({
				path: 'discount',
				select:'number_code'
			});
			let service = await Invoice_service.find({company: req.session.user.company._id, customer:req.body.id, isActive: true}).sort({createdAt: 1}).populate({
				path: 'service',
				select:'name number_code'
			})
			let log_service = await Log_service.find({company: req.session.user.company._id, customer:req.body.id, isActive: true}).sort({createdAt: -1}).populate({
				path: 'service',
				select:'name number_code'
			}).populate({
				path: 'employees',
				select:'name'
			})
			Admin_customer.sendData(res, {customer, history_sell, service, log_service});
		}catch(err){
			console.log(err.message)
			Admin_customer.sendError(res, err, err.message);
		}
	}
	static async update_data(req, res){
		try{
			let find = await Customer.findOne({company: req.session.user.company._id, _id: req.body.id});
			if(find){
				let check = await Customer.findOne({company: req.session.user.company._id, phone:req.body.phone});
				if(check && find.phone != req.body.phone){
					return Admin_customer.sendError(res, "Số điện thoại đã có người dùng", "Vui lòng xem lại thông tin đã nhập");
				}else{
					find.name = req.body.name;
					find.query_name = await Common.removeVietnameseTones(req.body.name);
					find.birthday = req.body.birthday;
					find.gener = req.body.gener;
					find.address = req.body.address;
					find.phone = req.body.phone;
					find.note = req.body.note;
					await find.save();
					Admin_customer.sendMessage(res, "Đã thay đổi thành công");
				}
			}else{
					Admin_customer.sendError(res, "Không tìm thấy sản phẩm", "Vui lòng thử lại");
			}
		}catch(err){
			console.log(err.message)
			Admin_customer.sendError(res, err, err.message);
		}
		
	}
}

module.exports = Admin_customer