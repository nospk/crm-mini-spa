const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Store = require('../../models/store');
const Storage_stocks = require('../../models/storage_stocks');
const Store_stocks = require('../../models/store_stocks');
const Brand_group = require('../../models/brand_group');
const Common = require("../../../core/common");
const mongoose = require('mongoose');
class Admin_product_service extends Controller{
    static show(req, res){
        Admin_product_service.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin_manager/product_service');
	}
	static async get_product_service(req, res){
        try{
			let product_service = await Product_service.find({company: req.session.user.company._id, type: {$ne:"combo"}, isActive: true});
			Admin_product_service.sendData(res, product_service);
		}catch(err){
			console.log(err)
			Admin_product_service.sendError(res, err, err.message);
        }
	}
	static async get_data(req, res){
		try{
			let {search_word, search_group, search_brand, search_type}=req.body
			let match = {
				$and: [ {company : mongoose.Types.ObjectId(req.session.user.company._id), isActive: true} ] 
			}
			if(search_word){
				search_word = await Common.removeVietnameseTones(search_word) 
				match.$and.push({$or:[{'number_code': {$regex: search_word,$options:"i"}},{'query_name': {$regex: search_word,$options:"i"}}]})
			}
			if(search_type){
				match.$and.push({$or:[{type: search_type}]})
			}
			if(search_group){
				match.$and.push({$or:[{'group': {$in: search_group}}]})
			}
			if(search_brand){
				match.$and.push({$or:[{brand:  mongoose.Types.ObjectId(search_brand)}]})
			}
			//set default variables
			let pageSize = 10
			let currentPage = req.body.paging_num || 1
			let sort = {createdAt: -1}
			// find total item
			let pages = await Product_service.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Product_service.find(match).sort(sort).skip((pageSize * currentPage) - pageSize).limit(pageSize).populate({
				path: 'stocks_in_storage',
				select: 'quantity'
			})
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
				select: 'store_name quantity product_of_sell product_of_service product_of_undefined'
			}).populate({
				path: 'stocks_in_storage',
				select: 'quantity'
			}).populate({
				path: 'combo.id',
			})
			if(data.type == "product"){
				let storage = await Storage_stocks.findOne({company: req.session.user.company._id, product: req.body.id}).populate({
					path: 'last_history',
				})
				data = Object.assign(data._doc, {storage_history:storage._doc});
			}
			Admin_product_service.sendData(res, data);
		}catch(err){
			console.log(err)
			Admin_product_service.sendError(res, err, err.message);
		}
	}
	static async create_new(req, res){
		try{
			let check = await Product_service.findOne({company: req.session.user.company._id, number_code:req.body.number_code, isActive: true});
			if(check){
				Admin_product_service.sendError(res, "Trùng mã số này", "Vui lòng chọn mã số khác");
				return;
			}
			if(req.body.type == "product"){
				let get_stores = await Store.find({company: req.session.user.company._id},{_id:1, name:1})
				let data = Product_service({
					name: req.body.name,
					query_name: await Common.removeVietnameseTones(req.body.name),
					type: req.body.type,
					cost_price: req.body.cost_price,
					price: req.body.price,
					quantity: 0,
					description: req.body.description,
					number_code: req.body.number_code,
					brand: req.body.brand,
					group: req.body.group,
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
			}else if(req.body.type == "service"){
				let data = Product_service({
					name: req.body.name,
					query_name: await Common.removeVietnameseTones(req.body.name),
					type: req.body.type,
					cost_price: req.body.cost_price,
					price: req.body.price,
					times: req.body.times,
					times_service: req.body.times_service,
					description: req.body.description,
					group: req.body.group,
					number_code: req.body.number_code,
					company: req.session.user.company._id,
				});
				await data.save()
			}else if(req.body.type == "hair_removel"){
				let data = Product_service({
					name: req.body.name,
					query_name: await Common.removeVietnameseTones(req.body.name),
					type: req.body.type,
					cost_price: req.body.cost_price,
					price: req.body.price,
					times: req.body.times,
					service_price: req.body.service_price,
					description: req.body.description,
					group: req.body.group,
					number_code: req.body.number_code,
					company: req.session.user.company._id,
				});
				await data.save()
			}else{
				let data = Product_service({
					name: req.body.name,
					query_name: await Common.removeVietnameseTones(req.body.name),
					type: req.body.type,
					combo: req.body.combo,
					cost_price: req.body.cost_price,
					price: req.body.price,
					group: req.body.group,
					description: req.body.description,
					number_code: req.body.number_code,
					company: req.session.user.company._id,
				});
				await data.save()
			}	
			Admin_product_service.sendMessage(res, "Đã tạo thành công");
			
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
					find.name = req.body.name;
					find.query_name = await Common.removeVietnameseTones(req.body.name);
					find.isSell = req.body.isSell;
					find.price = req.body.price;
					find.description = req.body.description;
					find.number_code = req.body.number_code;
					find.brand = req.body.brand;
					find.group = req.body.group;
					if(find.type == "service"){
						find.cost_price = req.body.cost_price;
						find.times = req.body.times;
						find.times_service = req.body.times_service;
					}
					if(find.type == "hair_removel"){
						find.cost_price = req.body.cost_price;
						find.service_price = req.body.service_price;
						find.times = req.body.times;
					}
					if(find.type == "combo"){
						find.cost_price = req.body.cost_price;
						find.combo = req.body.combo;
					}

					
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
			let check = await Product_service.findOneAndUpdate({company: req.session.user.company._id, _id: req.body.id}, {isActive: false, isSell: false});
			if(check.type != "combo"){
				await Product_service.findOneAndUpdate({company: req.session.user.company._id, type:"combo"}, {$pull: {combo: {id: check._id}}});
			}
			Admin_product_service.sendMessage(res, "Đã xóa thành công");
		}catch(err){
			console.log(err)
			Admin_product_service.sendError(res, err, err.message);
		}
	}
}

module.exports = Admin_product_service