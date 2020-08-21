const Controller = require('../../../core/controller');
const Employees = require('../../models/employees');
const mongoose = require('mongoose');
class Admin_employees extends Controller{
    static show(req, res){
        Admin_employees.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin_manager/employees');
    }
	static async create_new(req, res){
		try{
			let check = await Employees.findOne({company: req.session.user.company._id, number_code:req.body.number_code});
			if(check){
				Admin_employees.sendError(res, "Trùng mã số này", "Vui lòng chọn mã số khác");
			}else{
				let new_employees = Employees({
					name: req.body.name,
					birthday: req.body.birthday,
					address: req.body.address,
					number_code: req.body.number_code,
					identity_number: req.body.identity_number,
					company: req.session.user.company._id
				});
				await new_employees.save()
				Admin_employees.sendMessage(res, "Đã tạo thành công");
			}
		}catch(err){
			console.log(err.message)
			Admin_employees.sendError(res, err, err.message);
		}
		
	}
	static async get_data(req, res){
		try{
			let {search}=req.body
			let match = {
				$and: [ {company : mongoose.Types.ObjectId(req.session.user.company._id)} ] 
			}
			if(search){
				match.$and.push({$or:[{'number_code': {$regex: search,$options:"i"}},{'name': {$regex: search,$options:"i"}}]})
			}
			//set default variables
			let pageSize = 10
			let currentPage = req.body.paging_num || 1
	
			// find total item
			let pages = await Employees.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Employees.aggregate([{$match:match},{$skip:(pageSize * currentPage) - pageSize},{$limit:pageSize}])
			Admin_employees.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err.message)
			Admin_employees.sendError(res, err, err.message);
		}
	}
	static async edit_data(req, res){
		try{
			let data = await Employees.findOne({company: req.session.user.company._id, _id: req.body.id});
			Admin_employees.sendData(res, data);
		}catch(err){
			console.log(err.message)
			Admin_employees.sendError(res, err, err.message);
		}
	}
	static async update_data(req, res){
		try{
			let find = await Employees.findOne({company: req.session.user.company._id, _id: req.body.id});
			if(find){
				let check = await Employees.findOne({company: req.session.user.company._id, number_code:req.body.number_code});
				if(check && find.number_code != req.body.number_code){
					return Admin_employees.sendError(res, "Trùng mã số này", "Vui lòng chọn mã số khác");
				}else{
					find.name = req.body.name;
					find.birthday = req.body.birthday;
					find.address = req.body.address;
					find.identity_number = req.body.identity_number;
					find.number_code = req.body.number_code;
					await find.save();
					Admin_employees.sendMessage(res, "Đã thay đổi thành công");
				}
			}else{
					Admin_employees.sendError(res, "Không tìm thấy sản phẩm", "Vui lòng thử lại");
			}
		}catch(err){
			console.log(err.message)
			Admin_employees.sendError(res, err, err.message);
		}
		
	}
}

module.exports = Admin_employees