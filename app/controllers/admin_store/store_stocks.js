const Controller = require('../../../core/controller');
const Store = require('../../models/store');
const Common = require("../../../core/common");
const Product_service = require('../../models/product_service');
const Store_stocks = require('../../models/store_stocks');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
class Admin_store_stocks extends Controller{
    static show(req, res){
        Admin_store_stocks.setLocalValue(req,res);
        res.render('./pages/admin_store/store_stocks');
    }
	static async get_data(req, res){
		try{
			let {search}=req.body
			let match = {
				$and: [ {company : mongoose.Types.ObjectId(req.session.user.company._id), type: "product", isActive: true} ] 
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
			let data = await Product_service.find(match).sort({createdAt: -1}).skip((pageSize * currentPage) - pageSize).limit(pageSize).populate({
				path: 'stocks_in_store',
				populate: { path: 'Store_stocks' },
				match: { store_id: req.session.store_id },
				select: 'quantity product_of_sale product_of_service product_of_undefined'
			});
			Admin_store_stocks.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err)
			Admin_store_stocks.sendError(res, err, err.message);
		}
	}
	static async update_stocks(req, res){
		try{
			const {products} = req.body
			products.forEach(async item => {
				Store_stocks.findOneAndUpdate({company: req.session.user.company._id, _id: item.id}, {$inc: {product_of_sale:item.product_of_sale, product_of_service: item.product_of_service, product_of_undefined: (item.product_of_sale+item.product_of_service) * -1}}).exec()
			})
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
				populate: { path: 'Product_services' },
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
				populate: { path: 'Product_services' },
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