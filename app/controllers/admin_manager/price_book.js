const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Store = require('../../models/store');
const Storage_stocks = require('../../models/storage_stocks');
const Store_stocks = require('../../models/store_stocks');
const Brand_group = require('../../models/brand_group');
const mongoose = require('mongoose');
class Admin_price_book extends Controller{
    static show(req, res){
        Admin_price_book.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin_manager/price_book');
	}
	static async save_price_default(req, res){
        try{
			let product_service = await Product_service.findOneAndUpdate({company: req.session.user.company._id, _id:req.body.id},{$set:{price:req.body.price}});
			Admin_price_book.sendMessage(res, "Đã cập nhật thành công");
		}catch(err){
			console.log(err)
			Admin_price_book.sendError(res, err, err.message);
        }
	}
	static async get_data(req, res){
		try{
			let {search}=req.body
			let currentPage = req.body.paging_num || 1
			let pageSize = 10
			let sort = {createdAt: -1}
			let pages, pageCount, data
			if(search == "default"){
				// find total item
				pages = await Product_service.find({company : mongoose.Types.ObjectId(req.session.user.company._id), isActive: true}).countDocuments()
				// find total pages
				pageCount = Math.ceil(pages/pageSize)
				data = await Product_service.find({company : mongoose.Types.ObjectId(req.session.user.company._id), isActive: true}).sort(sort).skip((pageSize * currentPage) - pageSize).limit(pageSize)
			}	
			Admin_price_book.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err)
			Admin_price_book.sendError(res, err, err.message);
		}
	}
	static async get_store_groupCustomer(req, res){
		try{
			let stores = await Store.find({company: req.session.user.company._id});
			let groupCustomer = []
			Admin_price_book.sendData(res, {stores, groupCustomer});
		}catch(err){
			console.log(err)
			Admin_price_book.sendError(res, err, err.message);
		}
	}
	static async edit_data(req, res){
		try{
			let data = ""
			Admin_price_book.sendData(res, data);
		}catch(err){
			console.log(err)
			Admin_price_book.sendError(res, err, err.message);
		}
	}
	static async create_new(req, res){
		try{
			let {name, date_from, date_to, store, groupCustomer} = req.body
			console.log(name, date_from, date_to, store, groupCustomer)
				
			Admin_price_book.sendMessage(res, "Đã tạo thành công");
			
		}catch(err){
			console.log(err)
			Admin_price_book.sendError(res, err, err.message);
		}
		
	}
	static async update_data(req, res){
		try{
			let find = await Product_service.findOne({company: req.session.user.company._id, _id: req.body.id});
			if(find){
				let check = await Product_service.findOne({company: req.session.user.company._id, number_code:req.body.number_code});
				if(check && find.number_code != req.body.number_code){
					return Admin_price_book.sendError(res, "Trùng mã số này", "Vui lòng chọn mã số khác");
				}else{
					find.name = req.body.name;
					find.isSale = req.body.isSale;
					find.price = req.body.price;
					find.description = req.body.description;
					find.number_code = req.body.number_code;
					find.brand = req.body.brand;
					find.group = req.body.group;
					if(find.type == "service"){
						find.cost_price = req.body.cost_price;
					}
					if(find.type == "combo"){
						find.combo = req.body.combo;
					}
					
					await find.save();
					Admin_price_book.sendMessage(res, "Đã thay đổi thành công");
				}
			}else{
					Admin_price_book.sendError(res, "Không tìm thấy sản phẩm", "Vui lòng thử lại");
			}
		}catch(err){
			console.log(err)
			Admin_price_book.sendError(res, err, err.message);
		}
		
	}
	static async delete_data(req, res){
		try{
			let check = await Product_service.findOneAndUpdate({company: req.session.user.company._id, _id: req.body.id}, {isActive: false, isSale: false});
			if(check.type != "combo"){
				await Product_service.findOneAndUpdate({company: req.session.user.company._id, type:"combo"}, {$pull: {combo: {id: check._id}}});
			}
			Admin_price_book.sendMessage(res, "Đã xóa thành công");
		}catch(err){
			console.log(err)
			Admin_price_book.sendError(res, err, err.message);
		}
	}
}

module.exports = Admin_price_book