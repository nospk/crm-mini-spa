const Controller = require('../../../core/controller');
const Store = require('../../models/store');
const Common = require("../../../core/common");
const Product_service = require('../../models/product_service');
const Store_stocks = require('../../models/store_stocks');
const Customer = require('../../models/customer');
const Discount = require('../../models/discount');
const Employees = require('../../models/employees');
const Invoice_sale = require('../../models/invoice_sale');
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
			}).populate({
				path: 'combo.id',
				populate: { path: 'Product_services' },
			});
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
	static async get_by_id(req,res){
		try{
			let find = await Product_service.findOne({company :req.session.store.company, isSale: true, _id: req.body.id}).populate({
				path: 'stocks_in_store',
				match: { store_id: req.session.store._id },
				select: 'product_of_sale',
			}).populate({
				path: 'combo.id',
				populate: { path: 'Product_services' },
			});
			if(find.type == "product" && find.stocks_in_store[0].product_of_sale == 0){
				return Store_sale.sendError(res, "Sản phẩm hết hàng", "Vui lòng chọn sản phẩm khác hoặc thêm sản phẩm"); 
			}
			Store_sale.sendData(res, find);
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
	static async check_out(req, res){
		try{
			//check employees
			let check_employees = await Employees.findOne({company :req.session.store.company, _id: req.body.employees})
			if(!check_employees) return Store_sale.sendError(res, "Không tìm thấy nhân viên", "Vui lòng kiểm tra lại thông tin");
			// check quantity
			if(req.body.list_item == false){
				return Store_sale.sendError(res, "Lỗi chưa chọn sản phẩm - dịch vụ", "Vui lòng chọn lại");
			}
			let list_item = req.body.list_item;
			let list_sale = []
			let payment = 0;
			for(let i = 0, list_item_length = list_item.length; i < list_item_length; i++){
				let product = await Product_service.findOne({company :req.session.store.company, isSale: true, _id:list_item[i].id},{name:1, type: 1,price:1,number_code:1,stocks_in_store:1}).populate({
					path: 'stocks_in_store',
					match: { store_id: req.session.store._id },
					select: 'product_of_sale',
				})
				list_item[i] =  Object.assign(list_item[i], product._doc);
				if(list_item[i].type == 'product' && list_item[i].sell_quantity > list_item[i].stocks_in_store[0].product_of_sale){
					return Store_sale.sendError(res, `Lỗi sản phẩm [${list_item[i].name}] số lượng tồn không đủ`, "Vui lòng chọn lại");
				}else{
					payment += list_item[i].price * list_item[i].sell_quantity
					list_sale.push({
						id: list_item[i].id, 
						quantity: list_item[i].sell_quantity, 
						price: list_item[i].price
					})
				}
			}
			//check discount
			let money_discount = 0;
			if(req.body.discount_id){
				let check_discount = await Discount.findOne({company :req.session.store.company, _id: req.body.discount_id, isActive : true})
				if(check_discount){
					if(check_discount.type == "limit" && check_discount.times == check_discount.times_used){
						return Store_sale.sendError(res, "Mã giảm giá đã hết lần sử dụng", "Vui lòng nhập lại mã");
					}else{
						if(check_discount.type_discount == "money"){
							money_discount = check_discount.value
						}else{
							money_discount = Math.ceil(payment *check_discount.value /100)
						}
					}
				}else{
					return Store_sale.sendError(res, "Mã giảm giá không hợp lệ", "Vui lòng nhập lại mã");
				}
			}
			payment = payment - money_discount;
			//check customer
			if(req.body.customer){
				let check_customer = await Customer.findOne({company: req.session.store.company, _id:req.body.customer})
				if(!check_customer){
					return Store_sale.sendError(res, "Khách hàng không hợp lệ", "Vui lòng kiểm tra lại thông tin");
				}
					//console.log(check_customer)
			}
			
			//check payment
			if(req.body.customer_pay_card + req.body.customer_pay_cash < payment){
				return Store_sale.sendError(res, `Lỗi thanh toán chưa đủ số tiền`, "Kiểm tra lại số tiền đã nhập");
			}
			//invoice	
			let serial =  await Common.get_serial_store(req.session.store._id, 'BH')
			let invoice_sale = Invoice_sale({
				serial: serial,
				type : "sale",
				company: req.session.store.company,
				store: req.session.store._id,
				list_sale: list_sale,
				payment: payment,
				employees: req.body.employees != "" ? req.body.employees : undefined,
				customer: req.body.customer,
				discount: req.body.discount_id != "" ? req.body.discount_id : undefined
			})
			await invoice_sale.save()
			Store_sale.sendMessage(res, "Đã tạo thành công");
		}catch(err){
			console.log(err.message)
			Store_sale.sendError(res, err, err.message);
		}
	}
}

module.exports = Store_sale