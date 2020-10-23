const Controller = require('../../../core/controller');
const Store = require('../../models/store');
const Common = require("../../../core/common");
const Product_service = require('../../models/product_service');
const Store_stocks = require('../../models/store_stocks');
const Customer = require('../../models/customer');
const Discount = require('../../models/discount');
const Employees = require('../../models/employees');
class Store_sale extends Controller{
    static show(req, res){
        Store_sale.setLocalValue(req,res);
        res.render('./pages/store/store_sale');
    }
	static async search_product(req, res){
        try{
			let {search}=req.body
			let match = {
				$and: [ {company :req.session.store.company, isSale: true} ] 
			}
			if(search){
				match.$and.push({$or:[{'number_code': {$regex: search,$options:"i"}},{'name': {$regex: search,$options:"i"}}]})
			}
			let products = await Product_service.find(match).sort({createdAt: -1}).populate({
				path: 'stocks_in_store',
				match: { store_id: req.session.store._id },
				select: 'product_of_sale',
			})
			Store_sale.sendData(res, products);
		}catch(err){
			console.log(err)
			Store_sale.sendError(res, err, err.message);
		}
    }
	static async get_service(req, res){
        try{
			let match = {
				$and: [ {company :req.session.store.company, isSale: true, type: "service"} ] 
			}
			let services = await Product_service.find(match).sort({createdAt: -1})
			Store_sale.sendData(res, services);
		}catch(err){
			console.log(err)
			Store_sale.sendError(res, err, err.message);
		}
	}
	static async get_employees(req, res){
        try{
			let match = {
				$and: [ {company :req.session.store.company, isActive: true} ] 
			}
			let employees = await Employees.find(match).sort({createdAt: -1})
			Store_sale.sendData(res, employees);
		}catch(err){
			console.log(err)
			Store_sale.sendError(res, err, err.message);
		}
	}
	static async search_customer(req, res){
        try{
			let {search}=req.body
			let match = {
				$and: [ {company :req.session.store.company} ] 
			}
			if(search){
				match.$and.push({$or:[{'phone': {$regex: search,$options:"mi"}},{'name': {$regex: search,$options:"i"}}]})
			}
			let customers = await Customer.find(match).sort({createdAt: -1})
			Store_sale.sendData(res, customers);
		}catch(err){
			console.log(err)
			Store_sale.sendError(res, err, err.message);
		}
	}
	static async search_discount(req,res){
		try{
			let discount = await Discount.findOne({company :req.session.store.company, number_code: req.body.number_code, isActive : true})
			if(discount){
				if(discount.type == "limit" && discount.times == discount.times_used){
					return Store_sale.sendError(res, "Mã đã hết lần sử dụng", "Vui lòng nhập lại mã");
				}
				Store_sale.sendData(res, discount);
			}else{
				return Store_sale.sendError(res, "Mã không hợp lệ", "Vui lòng nhập lại mã");
			}
		}catch(err){
			console.log(err)
			Store_sale.sendError(res, err, err.message);
		}
	}
	static async create_customer(req, res){
		try{
			let check = await Customer.findOne({company: req.session.store.company, phone:req.body.phone});
			if(check){
				return Store_sale.sendError(res, "Số điện thoại đã có người dùng", "Vui lòng xem lại thông tin đã nhập");
			}else{
				let new_customer = Customer({
					name: req.body.name,
					birthday: req.body.birthday,
					address: req.body.address,
					note: req.body.note,
					phone: req.body.phone,
					gener: req.body.gener,
					company: req.session.store.company
				});
				await new_customer.save()
				Store_sale.sendMessage(res, "Đã tạo thành công");
			}
		}catch(err){
			console.log(err.message)
			Store_sale.sendError(res, err, err.message);
		}
		
	}
	static async send_payment(req, res){
		try{
			//check employees
			let check_employees = await Employees.findOne({company :req.session.store.company, _id: req.body.employees})
			if(!check_employees) return Store_sale.sendError(res, "Không tìm thấy nhân viên", "Vui lòng kiểm tra lại thông tin");
				//console.log(check_employees)
			//check discount
			if(req.body.number_code_discount){
				let check_discount = await Discount.findOne({company :req.session.store.company, number_code: req.body.number_code_discount, isActive : true})
				if(check_discount){
					if(check_discount.type == "limit" && check_discount.times == check_discount.times_used){
						return Store_sale.sendError(res, "Mã giảm giá đã hết lần sử dụng", "Vui lòng nhập lại mã");
					}
						//console.log(check_discount)
				}else{
					return Store_sale.sendError(res, "Mã giảm giá không hợp lệ", "Vui lòng nhập lại mã");
				}
			}
			//check customer
			if(req.body.customer){
				let check_customer = await Customer.findOne({company: req.session.store.company, _id:req.body.customer})
				if(!check_customer){
					return Store_sale.sendError(res, "Khách hàng không hợp lệ", "Vui lòng kiểm tra lại thông tin");
				}
					//console.log(check_customer)
			}
			// check quantity
			if(req.body.list_item == false){
				return Store_sale.sendError(res, "Lỗi chưa chọn sản phẩm - dịch vụ", "Vui lòng chọn lại");
			}
			let list_item = req.body.list_item;
			for(let i = 0, list_item_length = list_item.length; i < list_item_length; i++){
				let product = await Product_service.findOne({company :req.session.store.company, isSale: true, _id:list_item[i].id},{name:1, type: 1,price:1,number_code:1,stocks_in_store:1}).populate({
					path: 'stocks_in_store',
					match: { store_id: req.session.store._id },
					select: 'product_of_sale',
				})
				list_item[i] =  Object.assign(list_item[i], product._doc);
				if(list_item[i].type == 'product' && list_item[i].sell_quantity > list_item[i].stocks_in_store[0].product_of_sale){
					return Store_sale.sendError(res, `Lỗi sản phẩm [${list_item[i].name}] số lượng tồn không đủ`, "Vui lòng chọn lại");
				}
			}	
			console.log(list_item)
			Store_sale.sendMessage(res, "Đã tạo thành công");
		}catch(err){
			console.log(err.message)
			Store_sale.sendError(res, err, err.message);
		}
	}
}

module.exports = Store_sale