const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Store = require('../../models/store');
const Storage_stocks = require('../../models/storage_stocks');
const Store_stocks = require('../../models/store_stocks');
const mongoose = require('mongoose');
const Invoice_product_storage = require('../../models/invoice_product_storage');
class Admin_tranfer_stocks extends Controller{
    static show(req, res){
        Admin_tranfer_stocks.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin/tranfer_stocks');
    }
	static async get_data(req, res){
		try{
			//let {}=req.body
			let match = {
				$and: [ {company :req.session.user.company._id, type: "tranfer"} ] 
			}
			//set default variables
			let pageSize = 10
			let currentPage = req.body.paging_num || 1
	
			// find total item
			let pages = await Invoice_product_storage.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Invoice_product_storage.find(match).sort({createdAt: -1}).skip((pageSize * currentPage) - pageSize).limit(pageSize).populate({
				path: 'list_products.product_id',
				populate: { path: 'Product_services' },
				select: 'number_code'
			});
			Admin_store_stocks.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err)
			Admin_store_stocks.sendError(res, err, err.message);
        }
	}
}

module.exports = Admin_tranfer_stocks