const Controller = require('../../../core/controller');
const Store = require('../../models/store');
const Common = require("../../../core/common");
const Product_service = require('../../models/product_service');
const Store_stocks = require('../../models/store_stocks');
const Invoice_product_store = require('../../models/invoice_product_store');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
class Admin_store_stocks extends Controller{
    static show(req, res){
        Admin_store_stocks.setLocalValue(req,res);
        res.render('./pages/admin_store/store_stocks');
    }
	static async get_data(req, res){
		try{
			let {search_word, search_group, search_brand}=req.body
			let match = {
				$and: [ {company : mongoose.Types.ObjectId(req.session.user.company._id), type: "product", isActive: true} ] 
			}
			if(search_word){
				search_word = await Common.removeVietnameseTones(search_word) 
				match.$and.push({$or:[{'number_code': {$regex: search_word,$options:"i"}},{'query_name': {$regex: search_word,$options:"i"}}]})
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
	
			// find total item
			let pages = await Product_service.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Product_service.find(match).sort({createdAt: -1}).skip((pageSize * currentPage) - pageSize).limit(pageSize).populate({
				path: 'stocks_in_store',
				match: { store_id: req.session.store_id },
				select: 'quantity product_of_sell product_of_service product_of_undefined'
			});
			Admin_store_stocks.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err)
			Admin_store_stocks.sendError(res, err, err.message);
		}
	}
	static async set_stocks_classify(req, res){
		try{
			const {products} = req.body
			products.forEach(async item => {
				await Store_stocks.findOneAndUpdate({company: req.session.user.company._id, _id: item.id}, {$inc: {product_of_sell:item.product_of_sell, product_of_service: item.product_of_service, product_of_undefined: (item.product_of_sell+item.product_of_service) * -1}})
			})
			Admin_store_stocks.sendMessage(res, "Đã cập nhật thành công");
		}catch(err){
			console.log(err.message)
			Admin_store_stocks.sendError(res, err, err.message);
		}
		
	}
	static async get_storeStocks_productId(req,res){
		try{
			let store = await Store_stocks.findOne({company: req.session.user.company._id, store_id: req.session.store_id, _id: req.params.id}).populate({
				path: 'last_history',
			})
			Admin_store_stocks.sendData(res, store);
		}catch(err){
			console.log(err.message)
			Admin_store_stocks.sendError(res, err, err.message);
		}
	}
	static async check_stocks(req, res){
		try{
			const {products} = req.body
			let list_products = []
			let id = new mongoose.Types.ObjectId();
			for (let i = 0; i < products.length; i++){
				list_products.push({
					product: products[i].id,
					quantity: products[i].lost_stocks,
					current_quantity: products[i].current_quantity,
				})
				let store_stocks = await Store_stocks.findOneAndUpdate({company: req.session.user.company._id, store_id:req.session.store_id, product: products[i].id},{$set:{product_of_sell:products[i].product_of_sell, product_of_service:products[i].product_of_service, quantity:products[i].current_quantity}},{new: true})
				store_stocks.last_history = await Common.last_history(store_stocks.last_history, id);
				await store_stocks.save();
				await Product_service.findOneAndUpdate({company: req.session.user.company._id, type: "product", _id: products[i].id},{$inc:{quantity:Number(products[i].lost_stocks)*-1}})
			}
			let serial_stock =  await Common.get_serial_store(req.session.store_id, 'XH')
			let invoice_stock = Invoice_product_store({
				serial: serial_stock,
				type: "lost",
				company: req.session.user.company._id, 
				store: req.session.store_id, 
				list_products: list_products,
				who_created: req.session.user.name,
				_id: id
			})
			await invoice_stock.save()
			Admin_store_stocks.sendMessage(res, "Đã cập nhật thành công");
		}catch(err){
			console.log(err.message)
			Admin_store_stocks.sendError(res, err, err.message);
		}
	}
	static async get_product(req, res){
		try{
			let store = await Store_stocks.find({company: req.session.user.company._id, store_id: req.session.store_id, quantity:{$gt: 0}}).sort({createdAt: -1}).populate({
				path: 'product',
				select: 'name number_code'
			});
			Admin_store_stocks.sendData(res, store);
		}catch(err){
			console.log(err.message)
			Admin_store_stocks.sendError(res, err, err.message);
		}
	}
	static async get_product_of_undefined(req, res){
		try{
			let store = await Store_stocks.find({company: req.session.user.company._id, store_id: req.session.store_id, product_of_undefined:{$gt: 0}}).sort({createdAt: -1}).populate({
				path: 'product',
				select: 'name number_code'
			});
			Admin_store_stocks.sendData(res, store);
		}catch(err){
			console.log(err.message)
			Admin_store_stocks.sendError(res, err, err.message);
		}
	}
}

module.exports = Admin_store_stocks