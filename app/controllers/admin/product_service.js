const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Store = require('../../models/store');
const mongoose = require('mongoose');
class Admin_product_service extends Controller{
    static show(req, res){
        Admin_product_service.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin/product_service');
    }
	static async get_data(req, res){
		try{
			let {search}=req.body
			let match = {
				$and: [ {admin_id : mongoose.Types.ObjectId(req.session.user._id), isDelete: false} ] 
			}
			if(search){
				match.$and.push({$or:[{'number_code': {$regex: search,$options:"i"}},{'name': {$regex: search,$options:"i"}}]})
			}
			//set default variables
			let pageSize = 10
			let currentPage = req.body.paging_num || 1
	
			// find total item
			let pages = await Product_service.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Product_service.aggregate([{$match:match},{$skip:(pageSize * currentPage) - pageSize},{$limit:pageSize}])
			Admin_product_service.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err)
			Admin_product_service.sendError(res, err, err.message);
		}
	}
	static async edit_data(req, res){
		try{
			let data = await Product_service.findOne({admin_id: req.session.user._id, _id: req.body.id}).populate({
				path: 'stocks_in.store',
				populate: { path: 'Stores' },
				select: 'name'
			});
			Admin_product_service.sendData(res, data);
		}catch(err){
			console.log(err)
			Admin_product_service.sendError(res, err, err.message);
		}
	}
	static async create_new(req, res){
		try{
			let check = await Product_service.findOne({admin_id: req.session.user._id, number_code:req.body.number_code});
			if(check){
				Admin_product_service.sendError(res, "Trùng mã số này", "Vui lòng chọn mã số khác");
			}else{
				let get_stores = await Store.find({'user_manager.id_admin': req.session.user._id},{_id:1})
				let data = ({
					name: req.body.name,
					type: req.body.type,
					cost_price: req.body.cost_price,
					price: req.body.price,
					description: req.body.description,
					number_code: req.body.number_code,
					admin_id: req.session.user._id,
					stocks_in:[]
				});
				for(let i = 0; i < get_stores.length; i++){
					data.stocks_in.push({
						store : get_stores[i],
					})
				}
				let new_product_service = Product_service(data)
				await new_product_service.save()
				Admin_product_service.sendMessage(res, "Đã tạo thành công");
			}
		}catch(err){
			console.log(err)
			Admin_product_service.sendError(res, err, err.message);
		}
		
	}
	static async update_data(req, res){
		try{
			let find = await Product_service.findOne({admin_id: req.session.user._id, _id: req.body.id});
			if(find){
				let check = await Product_service.findOne({admin_id: req.session.user._id, number_code:req.body.number_code});
				if(check && find.number_code != req.body.number_code){
					return Admin_product_service.sendError(res, "Trùng mã số này", "Vui lòng chọn mã số khác");
				}else{
					if(find.type == "service"){
						find.cost_price = req.body.cost_price;
					}
					find.name = req.body.name;
					find.isActive = req.body.isActive;
					find.price = req.body.price;
					find.description = req.body.description;
					find.number_code = req.body.number_code;
					await find.save();
					Admin_product_service.sendMessage(res, "Đã thay đổi thành công");
				}
			}else{
					Admin_product_service.sendError(res, "Không tìm thấy sản phẩm", "Vui lòng thử lại");
			}
		}catch(err){
			console.log(err)
			Admin_product_service.sendError(res, err, err.message);
		}
		
	}
	static async delete_data(req, res){
		try{
			await Product_service.findOneAndUpdate({admin_id: req.session.user._id, _id: req.body.id}, {isDelete: true, isActive: false});
			Admin_product_service.sendMessage(res, "Đã xóa thành công");
		}catch(err){
			console.log(err)
			Admin_product_service.sendError(res, err, err.message);
		}
	}
}

module.exports = Admin_product_service