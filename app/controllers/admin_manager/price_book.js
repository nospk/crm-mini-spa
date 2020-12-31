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
			if(req.body.price_book == "default"){
				await Product_service.findOneAndUpdate({company: req.session.user.company._id, _id:req.body.id},{$set:{price:req.body.price}});
			
			}else{
				await Product_service.findOneAndUpdate({company: req.session.user.company._id, _id:req.body.id, price_book:{$elemMatch:{id:req.body.price_book}}},{$set:{'price_book.$.price_sale':req.body.price}});
			}
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
	static async get_edit_data(req, res){
		try{
			let price_book = await Price_book.findOne({company: req.session.user.company._id, _id: req.body.price_book})
			Admin_price_book.sendData(res, price_book);
		}catch(err){
			console.log(err)
			Admin_price_book.sendError(res, err, err.message);
		}
	}
	static async edit_price_book(req, res){
		try{
			let {name, date_from, date_to, store, groupCustomer} = req.body
			let check = await Price_book.findOne({company:req.session.user.company._id, _id: req.body.id})
			console.log(new Date(date_from))
			if(check){
				check.name = name
				check.store = store ? store : []
				check.group_customer = groupCustomer ? groupCustomer : []
				check.date_from = new Date(date_from)
				check.date_to =  new Date(date_to)
				await check.save()
			}else{
				Admin_price_book.sendError(res, "Lỗi không tìm thấy bảng giá","Vui lòng thử lại");
			}
			Admin_price_book.sendMessage(res, "Thay đổi thông tin thành công");
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
	static async add_item(req, res){
		try{
			let check_product = await Product_service.findOne({company: req.session.user.company._id, _id: req.body.id})
			if(check_product){
				let check_double = await Price_book.findOne({company: req.session.user.company._id, _id: req.body.price_book,list_product_service: req.body.id})
				if(!check_double){
					await Price_book.findOneAndUpdate({company: req.session.user.company._id, _id: req.body.price_book},{$push:{list_product_service: req.body.id}})
					check_product.price_book.push({id: req.body.price_book, price_sale: check_product.price})
					await check_product.save()
				}
				Admin_price_book.sendMessage(res, "Đã tạo thành công");
			}else{
				Admin_price_book.sendError(res, "Không tìm thấy", "Vui lòng thử lại");
			}
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
	static async get_items(req, res){
		try{
			let check = await Price_book.findOne({company: req.session.user.company._id, _id: req.body.price_book})
			let items = await Product_service.find({company: req.session.user.company._id, isActive: true, _id: {$nin: check.list_product_service}})
			Admin_price_book.sendData(res, items);
		}catch(err){
			console.log(err)
			Admin_price_book.sendError(res, err, err.message);
		}
		
	}
	static async delete_item(req, res){
		try{
			await Price_book.findOneAndUpdate({company: req.session.user.company._id, _id: req.body.price_book},{$pull:{list_product_service: req.body.id}})
			await Product_service.findOneAndUpdate({company: req.session.user.company._id, _id:req.body.id},{$pull: {price_book:{id:req.body.price_book}}});
			Admin_price_book.sendMessage(res, "Đã xóa thành công");
		}catch(err){
			console.log(err)
			Admin_price_book.sendError(res, err, err.message);
		}
	}
}

module.exports = Admin_price_book