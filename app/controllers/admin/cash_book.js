const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Storage_stocks = require('../../models/storage_stocks');
const Supplier = require('../../models/supplier');
const Invoice_product_storage = require('../../models/invoice_product_storage');
const Cash_book = require('../../models/cash_book');
const Common = require("../../../core/common");
class Admin_cash_book extends Controller{
    static show(req, res){
        Admin_cash_book.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin/cash_book');
    }
	static async get_data(req, res){
        try{
			//let {}=req.body
			let match = {
				$and: [ {company :req.session.user.company._id} ] 
			}
			//set default variables
			let pageSize = 10
			let currentPage = req.body.paging_num || 1
	
			// find total item
			let pages = await Cash_book.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Cash_book.find(match).sort({createdAt: -1}).skip((pageSize * currentPage) - pageSize).limit(pageSize)
			Admin_cash_book.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err)
			Admin_cash_book.sendError(res, err, err.message);
        }
    }
	
}

module.exports = Admin_cash_book