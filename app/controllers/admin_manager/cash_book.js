const Controller = require('../../../core/controller');
const Supplier = require('../../models/supplier');
const Invoice_product_storage = require('../../models/invoice_product_storage');
const Cash_book = require('../../models/cash_book');
const Common = require("../../../core/common");
const Employees = require('../../models/employees');
const Customer = require('../../models/customer');
const Store = require('../../models/store');
const mongoose = require('mongoose');
class Admin_cash_book extends Controller{
    static show(req, res){
        Admin_cash_book.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin_manager/cash_book');
    }
	static async get_data(req, res){
        try{
			let {search_find_store, search_find_selection}=req.body
			let match = {
				$and: [ {company :req.session.user.company._id} ] 
			}
			if(search_find_selection == "company"){
				match.$and.push({isForCompany: true})
			}else{
				match.$and.push({store: search_find_store})
			}
			//set default variables
			let pageSize = 10
			let currentPage = req.body.paging_num || 1
			let company = req.session.user.company.name
			// find total item
			let pages = await Cash_book.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Cash_book.find(match).sort({createdAt: -1}).skip((pageSize * currentPage) - pageSize).limit(pageSize).populate({
				path: 'store',
				populate: { path: 'Stores' },
				select: 'name'
			});
			Admin_cash_book.sendData(res, {data, pageCount, currentPage, company});
		}catch(err){
			console.log(err)
			Admin_cash_book.sendError(res, err, err.message);
        }
    }
	static async getStoreSupplierCustomerEmployees(req, res){
		try{
			let customers = await Customer.find({company: req.session.user.company._id, isActive: true});
			let suppliers = await Supplier.find({company: req.session.user.company._id, isActive: true});
			let employees = await Employees.find({company: req.session.user.company._id, isActive: true});
			let stores = await Store.find({company: req.session.user.company._id, isActive: true});
			Admin_cash_book.sendData(res, {suppliers, employees, stores, customers});
		}catch(err){
			console.log(err)
			Admin_cash_book.sendError(res, err, err.message);
        }
	}
	static async create_new(req, res){
		try{
			const {type, type_receiver, select_supplier, select_employees, isForCompany, select_store, payment, note, group, accounting, select_customer} = req.body;
			let serial, current_money, member_name, member_id, str;
			if(isForCompany == true){
				if(type == "outcome"){
					current_money = await Common.get_current_money(req.session.user.company._id, payment * -1)
					serial = await Common.get_serial_company(req.session.user.company._id, 'TTCT')
				}else{ 
					current_money = await Common.get_current_money(req.session.user.company._id, payment)
					serial = await Common.get_serial_company(req.session.user.company._id, 'TTNT')
					}
			}else{
				if(type == "outcome"){ 
					current_money = await Common.get_current_money_store(req.session.user.company._id, select_store, payment * -1)
					serial = await Common.get_serial_store(select_store, 'TTCT')
				}else{
					current_money = await Common.get_current_money_store(req.session.user.company._id, select_store, payment)
					serial = await Common.get_serial_store(select_store, 'TTNT')
				}
			}
			let debt
			switch(type_receiver){
				case "supplier":
					str = select_supplier.split(":");
					member_name = str[0];
					member_id = str[1];
					debt = type == "outcome" ? payment * -1 : payment;
					let supplier = await Supplier.findOneAndUpdate({company: req.session.user.company._id, _id: member_id},{$inc:{debt:debt}})
					break;
				case "employees":
					str = select_employees.split(":");
					member_name = str[0];
					member_id = str[1];
					break;
				case "customers":
					str = select_customer.split(":");
					member_name = str[0];
					member_id = str[1];
					debt = type == "outcome" ? payment * -1 : payment;
					let customer = await Customer.findOneAndUpdate({company: req.session.user.company._id, _id: member_id},{$inc:{debt:debt}})
					break;
				default:
					member_name = "Khác";
					break;
			}
			let cash_book = Cash_book({
				serial: serial,
				type: type,
				company:req.session.user.company._id,
				money: payment,
				current_money: current_money,
				isForCompany: isForCompany == true ? true : false,
				group: group,
				user_created: req.session.user.name,
				member_name: member_name,
				member_id: type_receiver != "different" ? mongoose.Types.ObjectId(member_id) : undefined,
				note: note,
				accounting: accounting,
				store: isForCompany == true ? undefined : select_store
			})
			await cash_book.save()
			Admin_cash_book.sendMessage(res, "Đã tạo thành công");
		}catch(err){
			console.log(err.message)
			Admin_cash_book.sendError(res, err, err.message);
		}
		
	}
}

module.exports = Admin_cash_book