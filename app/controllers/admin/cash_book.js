const Controller = require('../../../core/controller');
const Supplier = require('../../models/supplier');
const Invoice_product_storage = require('../../models/invoice_product_storage');
const Cash_book = require('../../models/cash_book');
const Common = require("../../../core/common");
const Employees = require('../../models/employees');
const Store = require('../../models/store');
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
			let data = await Cash_book.find(match).sort({createdAt: -1}).skip((pageSize * currentPage) - pageSize).limit(pageSize).populate({
				path: 'cost_for_company',
				populate: { path: 'Company' },
				select: 'name'
			})
			Admin_cash_book.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err)
			Admin_cash_book.sendError(res, err, err.message);
        }
    }
	static async getStoreSupplierEmployees(req, res){
		try{
			let suppliers = await Supplier.find({company: req.session.user.company._id, isActive: true});
			let employees = await Employees.find({company: req.session.user.company._id, isActive: true});
			let stores = await Store.find({company: req.session.user.company._id, isActive: true});
			Admin_cash_book.sendData(res, {suppliers, employees, stores});
		}catch(err){
			console.log(err)
			Admin_cash_book.sendError(res, err, err.message);
        }
	}
}

module.exports = Admin_cash_book