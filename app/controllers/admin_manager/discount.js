const Controller = require('../../../core/controller');
const Discount = require('../../models/discount');
const mongoose = require('mongoose');
class Admin_discount extends Controller{
    static show(req, res){
        Admin_discount.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin_manager/discount');
    }
	static async create_new(req, res){
		try{
			if(req.body.name == ""){
				return Admin_discount.sendError(res, "Chưa nhập tên", "Vui lòng nhập tên");
			}
			if(req.body.number_code == ""){
				return Admin_discount.sendError(res, "Chưa nhập mã giảm giá", "Vui lòng nhập mã giảm giá");
			}
			let check = await Discount.findOne({company: req.session.user.company._id, number_code:req.body.number_code});
			if(check){
				return Admin_discount.sendError(res, "Mã này đã có", "Vui lòng chọn mã khác");
			}
            if(req.body.type == "limit" && req.body.times == ""){
				return Admin_discount.sendError(res, "Mã giới hạn phải có số lượng", "Vui lòng nhập số lượng");
			}
			if(req.body.value == 0){
				return Admin_discount.sendError(res, "Chưa nhập giảm giá bao nhiêu", "Vui lòng nhập giảm giá");
			}
			let new_discount = Discount({
				name: req.body.name,
				query_name: await Common.removeVietnameseTones(req.body.name),
				number_code: req.body.number_code,
				type: req.body.type,
				type_discount: req.body.type_discount,
				value: req.body.value,
                times: req.body.times,
                isActive: req.body.isActive,
				company: req.session.user.company._id
			});
				await new_discount.save()
				Admin_discount.sendMessage(res, "Đã tạo thành công");
			
		}catch(err){
			console.log(err.message)
			Admin_discount.sendError(res, err, err.message);
		}
	}
	static async get_data(req, res){
		try{
			let {search}=req.body
			let match = {
				$and: [ {company : mongoose.Types.ObjectId(req.session.user.company._id), isDelete: false} ] 
			}
			if(search){
				search = await Common.removeVietnameseTones(search) 
				match.$and.push({$or:[{'number_code': {$regex: search,$options:"i"}},{'query_name': {$regex: search,$options:"i"}}]})
			}
			//set default variables
			let pageSize = 10
			let currentPage = req.body.paging_num || 1
	
			// find total item
			let pages = await Discount.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Discount.aggregate([{$match:match},{$skip:(pageSize * currentPage) - pageSize},{$limit:pageSize}])
			Admin_discount.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err.message)
			Admin_discount.sendError(res, err, err.message);
		}
	}
	static async edit_data(req, res){
		try{
			let data = await Discount.findOne({company: req.session.user.company._id, _id: req.body.id});
			Admin_discount.sendData(res, data);
		}catch(err){
			console.log(err.message)
			Admin_discount.sendError(res, err, err.message);
		}
	}
	static async update_data(req, res){
		try{
			if(req.body.name == ""){
				return Admin_discount.sendError(res, "Chưa nhập tên", "Vui lòng nhập tên");
			}
			if(req.body.number_code == ""){
				return Admin_discount.sendError(res, "Chưa nhập mã giảm giá", "Vui lòng nhập mã giảm giá");
			}
			let find = await Discount.findOne({company: req.session.user.company._id, _id: req.body.id});
			if(find){
				let check = await Discount.findOne({company: req.session.user.company._id, number_code:req.body.number_code});
				if(check && find.number_code != req.body.number_code){
					return Admin_discount.sendError(res, "Mã này đã có", "Vui lòng chọn mã khác");
                }
                if(req.body.type == "limit" && req.body.times == ""){
                    return Admin_discount.sendError(res, "Mã giới hạn phải có số lượng", "Vui lòng nhập số lượng");
				}
				if(req.body.value == 0){
					return Admin_discount.sendError(res, "Chưa nhập giảm giá bao nhiêu", "Vui lòng nhập giảm giá");
				}
				find.name = req.body.name;
				find.query_name = await Common.removeVietnameseTones(req.body.name);
				find.number_code = req.body.number_code;
				find.type = req.body.type;
				find.type_discount = req.body.type_discount;
				find.value = req.body.value;
                find.times = req.body.times;
				find.isActive = req.body.isActive;
				await find.save();
				Admin_discount.sendMessage(res, "Đã thay đổi thành công");
			}else{
				return Admin_discount.sendError(res, "Không tìm thấy mã", "Vui lòng thử lại");
			}
		}catch(err){
			console.log(err.message)
			Admin_discount.sendError(res, err, err.message);
		}
		
    }
    static async delete_data(req, res){
		try{
			await Discount.findOneAndUpdate({company: req.session.user.company._id, _id: req.body.id}, {isActive: false, isDelete: true});
			Admin_discount.sendMessage(res, "Đã xóa thành công");
		}catch(err){
			console.log(err)
			Admin_discount.sendError(res, err, err.message);
		}
	}
}

module.exports = Admin_discount