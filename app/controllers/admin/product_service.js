const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Store = require('../../models/store');
const Storage_stocks = require('../../models/storage_stocks');
const Store_stocks = require('../../models/store_stocks');
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
				$and: [ {company : mongoose.Types.ObjectId(req.session.user.company._id), isDelete: false} ] 
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
			let data = await Product_service.findOne({company: req.session.user.company._id, _id: req.body.id}).populate({
				path: 'stocks_in_store',
				populate: { path: 'Stores' },
				select: 'store_name quantity'
			}).populate({
				path: 'stocks_in_storage',
				populate: { path: 'Storage_stocks' },
				select: 'quantity'
			});
			Admin_product_service.sendData(res, data);
		}catch(err){
			console.log(err)
			Admin_product_service.sendError(res, err, err.message);
		}
	}
	static async create_new(req, res){
		try{
			let check = await Product_service.findOne({company: req.session.user.company._id, number_code:req.body.number_code});
			if(check){
				Admin_product_service.sendError(res, "Trùng mã số này", "Vui lòng chọn mã số khác");
			}else{
				let get_stores = await Store.find({company: req.session.user.company._id},{_id:1, name:1})
				let data = Product_service({
					name: req.body.name,
					type: req.body.type,
					cost_price: req.body.cost_price,
					price: req.body.price,
					description: req.body.description,
					number_code: req.body.number_code,
					company: req.session.user.company._id,
				});
				await data.save()
				let storage_stocks = Storage_stocks({
					product : data._id,
					company: req.session.user.company._id,
				})
				await storage_stocks.save()
				let stocks_in_store = []
				for (let i = 0; i < get_stores.length; i++ ){
					let store_stocks = Store_stocks({
						product : data._id,
						store_name: get_stores[i].name,
						store_id: get_stores[i]._id,
						company: req.session.user.company._id,
					})
					await store_stocks.save()
					stocks_in_store.push(store_stocks._id)
				}
				data.stocks_in_storage = storage_stocks._id
				data.stocks_in_store = stocks_in_store
				await data.save()
				Admin_product_service.sendMessage(res, "Đã tạo thành công");
			}
		}catch(err){
			console.log(err)
			Admin_product_service.sendError(res, err, err.message);
		}
		
	}
	static async update_data(req, res){
		try{
			let find = await Product_service.findOne({company: req.session.user.company._id, _id: req.body.id});
			if(find){
				let check = await Product_service.findOne({company: req.session.user.company._id, number_code:req.body.number_code});
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
			await Product_service.findOneAndUpdate({company: req.session.user.company._id, _id: req.body.id}, {isDelete: true, isActive: false});
			Admin_product_service.sendMessage(res, "Đã xóa thành công");
		}catch(err){
			console.log(err)
			Admin_product_service.sendError(res, err, err.message);
		}
	}
}

module.exports = Admin_product_service