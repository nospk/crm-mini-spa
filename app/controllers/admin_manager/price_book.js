const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Store = require('../../models/store');
const Price_book = require('../../models/price_book');
const mongoose = require('mongoose');
class Admin_price_book extends Controller{
    static show(req, res){
        Admin_price_book.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin_manager/price_book');
	}
	static async save_price(req, res){
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
			}else{
				let price_book = await Price_book.findOne({company: req.session.user.company._id, _id: req.body.search})
				pages = await Product_service.find({company : mongoose.Types.ObjectId(req.session.user.company._id),_id: price_book.list_product_service, isActive: true}).countDocuments()
				pageCount = Math.ceil(pages/pageSize)
				data = await Product_service.find({company : mongoose.Types.ObjectId(req.session.user.company._id),_id: price_book.list_product_service, isActive: true}).sort(sort).skip((pageSize * currentPage) - pageSize).limit(pageSize)
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
	static async edit_price_book(req, res){
		try{
			let data = ""
			Admin_price_book.sendData(res, data);
		}catch(err){
			console.log(err)
			Admin_price_book.sendError(res, err, err.message);
		}
	}
	static async create_price_book(req, res){
		try{
			let {name, date_from, date_to, store, groupCustomer} = req.body
			let data = Price_book({
				name: name,
				company: req.session.user.company._id,
				store: store,
				group_customer: groupCustomer,
				date_from: new Date(date_from),
				date_to: new Date(date_to),
			})
			await data.save()
			Admin_price_book.sendMessage(res, "Đã tạo thành công");
			
		}catch(err){
			console.log(err)
			Admin_price_book.sendError(res, err, err.message);
		}
		
	}
	static async get_price_book(req, res){
		try{
			let price_book = await Price_book.find({company: req.session.user.company._id})
			Admin_price_book.sendData(res, price_book);
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