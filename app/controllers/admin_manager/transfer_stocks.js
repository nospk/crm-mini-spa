const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Store = require('../../models/store');
const Storage_stocks = require('../../models/storage_stocks');
const Store_stocks = require('../../models/store_stocks');
const Common = require("../../../core/common");
const mongoose = require('mongoose');
const Invoice_product_storage = require('../../models/invoice_product_storage');
const Invoice_product_store = require('../../models/invoice_product_store');
class Admin_transfer_stocks extends Controller{
    static show(req, res){
        Admin_transfer_stocks.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin_manager/transfer_stocks');
	}
	static async getStoresAndProducts(req, res){
        try{
			let products = await Product_service.find({company: req.session.user.company._id, type: "product", isActive: true}).populate({
				path: 'stocks_in_storage',
				select: 'quantity'
			});
			let stores = await Store.find({company: req.session.user.company._id, isActive: true});
			Admin_transfer_stocks.sendData(res, {products, stores});
		}catch(err){
			console.log(err)
			Admin_transfer_stocks.sendError(res, err, err.message);
        }
	}
	static async get_data(req, res){
		try{
			//let {}=req.body
			let match = {
				$and: [ {company :req.session.user.company._id, type: "transfer"} ] 
			}
			//set default variables
			let pageSize = 10
			let currentPage = req.body.paging_num || 1
	
			// find total item
			let pages = await Invoice_product_storage.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Invoice_product_storage.find(match).sort({createdAt: -1}).skip((pageSize * currentPage) - pageSize).limit(pageSize).populate({
				path: 'list_products.product',
				select: 'number_code name'
			}).populate({
				path: 'store',
				select: 'name'
			});
			Admin_transfer_stocks.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err)
			Admin_transfer_stocks.sendError(res, err, err.message);
        }
	}
	static async create_new(req, res){
		try{
            const {products, store, note, time} = req.body;
			let serial_XH = await Common.get_serial_company(req.session.user.company._id, 'XH')
			let serial_NH = await Common.get_serial_store(store, 'NH')
			let invoice_product_storage = Invoice_product_storage({
				createdAt: time,
				serial: serial_XH,
				type: 'transfer',
				company: req.session.user.company._id,
				store: store,
				who_created: req.session.user.name,
				note: note,
				list_products: products
			});
			let invoice_product_store = Invoice_product_store({
				createdAt: time,
				serial: serial_NH,
				type: 'import',
				company: req.session.user.company._id,
				who_created: req.session.user.name,
				store: store,
				list_products: products
			});
			await invoice_product_store.save()
			await invoice_product_storage.save()
            for (let i = 0; i < products.length; i++){
				let storage_stocks = await Storage_stocks.findOne({company: req.session.user.company._id, product: products[i].product})
				let store_stocks = await Store_stocks.findOneAndUpdate({company: req.session.user.company._id, store_id:store, product: products[i].product},{$inc:{product_of_undefined:Number(products[i].quantity), quantity:Number(products[i].quantity)}},{new: true})
				invoice_product_store.list_products[i].current_quantity = store_stocks.quantity
				store_stocks.last_history = await Common.last_history(store_stocks.last_history, invoice_product_store._id)
				storage_stocks.quantity = Number(storage_stocks.quantity) - Number(products[i].quantity)
				invoice_product_storage.list_products[i].current_quantity = Number(storage_stocks.quantity)
				storage_stocks.last_history = await Common.last_history(storage_stocks.last_history, invoice_product_storage._id)
				storage_stocks.save();
				store_stocks.save();
			}
			invoice_product_storage.invoice_store = invoice_product_store._id
			await invoice_product_store.save()
			await invoice_product_storage.save()
            Admin_transfer_stocks.sendMessage(res, "Đã tạo thành công");
		}catch(err){
			console.log(err)
			Admin_transfer_stocks.sendError(res, err, err.message);
		}
		
    }
}

module.exports = Admin_transfer_stocks