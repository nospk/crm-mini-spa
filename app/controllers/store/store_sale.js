const Controller = require('../../../core/controller');
const Store = require('../../models/store');
const Common = require("../../../core/common");
const Product_service = require('../../models/product_service');
const Store_stocks = require('../../models/store_stocks');
const Customer = require('../../models/customer');
const Discount = require('../../models/discount');
const mongoose = require('mongoose');
const Employees = require('../../models/employees');
const Invoice_sale = require('../../models/invoice_sale');
const Invoice_product_store = require('../../models/invoice_product_store');
const Invoice_service = require('../../models/invoice_service');
const Cash_book = require('../../models/cash_book');
const Price_book = require('../../models/price_book');
const Log_service = require('../../models/log_service');
const check_price_book = (item, price_book) => {
	if(!item.price_book){
		return item.price
	}
	let index = item.price_book.findIndex(element =>{
		return element.id == price_book
	})
	if(item.price_book[index]){
		return item.price_book[index].price_sale
	}else{
		return item.price
	}
}
class Store_sale extends Controller{
    static show(req, res){
        Store_sale.setLocalValue(req,res);
		res.locals.manager = (req.session.manager && req.session.manager != "") ? true : false;
		if(!req.session.manager) req.session.manager = ""
        res.render('./pages/store/store_sale');
    }
	static async search_product(req, res){
        try{
			let {search}=req.body
			let match = {
				$and: [ {company :req.session.store.company, isSale: true} ] 
			}
			if(search){
				search = await Common.removeVietnameseTones(search);
				match.$and.push({$or:[{'number_code': {$regex: search,$options:"i"}},{'query_name': {$regex: search,$options:"i"}}]})
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
	static async get_invoice_sale_id(req, res){
        try{
			let data = await Invoice_sale.findOne({company : req.session.store.company, _id: req.params.id}).populate({
				path: 'customer',
				populate: { path: 'Customer'},
				select: 'name'
			}).populate({
				path: 'list_item.id',
				populate: { path: 'Product_services'},
			}).populate({
				path: 'bill',
				populate: { path: 'Cash_book'},
				select:'type_payment money'
			})
			Store_sale.sendData(res, data);
		}catch(err){
			console.log(err)
			Store_sale.sendError(res, err, err.message);
		}
	}
	static async get_invoice_sale(req, res){
        try{
			let now = new Date();
			let start_month = new Date(now.getFullYear(),now.getMonth(),1,0,0,0);
			let end_month = new Date(now.getFullYear(),Number(now.getMonth())+1,1,0,0,0);

			// let match = {
			// 	$and: [ {company : mongoose.Types.ObjectId(req.session.store.company), createdAt: {$gte: start_month, $lt: end_month}} ] 
			// }
			let match = {
				$and: [ {company : mongoose.Types.ObjectId(req.session.store.company)} ] 
			}
			//set default variables
			let pageSize = 20
			let currentPage = req.body.paging_num || 1
	
			// find total item
			let pages = await Invoice_sale.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Invoice_sale.find(match).sort({createdAt: -1}).skip((pageSize * currentPage) - pageSize).limit(pageSize).populate({
				path: 'customer',
				populate: { path: 'Customer'},
				select: 'name'
			}).populate({
				path: 'employees',
				populate: { path: 'Employees'},
				select: 'name'
			}).populate({
				path: 'list_item.id',
				populate: { path: 'Product_services'},
				select:'name number_code'
			}).populate({
				path: 'bill',
				populate: { path: 'Cash_book'},
				select:'type_payment money'
			})
			Store_sale.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err)
			Store_sale.sendError(res, err, err.message);
		}
	}
	static async get_employees(req, res){
        try{
			let match = {
				$and: [ {company :req.session.store.company, store: req.session.store._id, isActive: true} ] 
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
			})
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
				search = await Common.removeVietnameseTones(search);
				match.$and.push({$or:[{'phone': {$regex: search,$options:"mi"}},{'query_name': {$regex: search,$options:"i"}}]})
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
	static async get_customer(req, res){
		try{
			let customer = await Customer.findOne({company: req.session.store.company, _id: req.body.id});
			let history_sale = await Invoice_sale.find({company: req.session.store.company, customer:req.body.id}).sort({createdAt: -1}).limit(20).populate({
				path: 'list_item.id',
				populate: { path: 'Product_services'},
				select:'name number_code'
			}).populate({
				path: 'employees',
				populate: { path: 'Employees'},
				select:'name'
			}).populate({
				path: 'discount',
				populate: { path: 'Discount'},
				select:'number_code'
			});
			let service = await Invoice_service.find({company: req.session.store.company, customer:req.body.id, isActive: true}).sort({createdAt: 1}).populate({
				path: 'service',
				populate: { path: 'Product_services'},
				select:'name number_code'
			})
			let log_service = await Log_service.find({company: req.session.store.company, customer:req.body.id, isActive: true}).sort({createdAt: -1}).populate({
				path: 'service',
				populate: { path: 'Product_services'},
				select:'name number_code'
			}).populate({
				path: 'employees',
				populate: { path: 'Employees'},
				select:'name'
			})
			Store_sale.sendData(res, {customer, history_sale, service, log_service});
		}catch(err){
			console.log(err.message)
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
					query_name: await Common.removeVietnameseTones(req.body.name),
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
	static async get_price_book(req, res){
		try{
			let date_now = new Date();
			let price_book = await Price_book.find({company: req.session.store.company, date_from:{$lt: date_now}, date_to:{$gt: date_now}, $or:[{store:[]},{store:req.session.store._id}]})
			Store_sale.sendData(res, price_book);
		}catch(err){
			console.log(err)
			Store_sale.sendError(res, err, err.message);
		}
		
	}
	static async use_service(req,res){
		try{
			let service =  await Product_service.findOne({company :req.session.store.company, _id: req.body.service})
			let log 
			let invoice_service = await Invoice_service.findOneAndUpdate({company:req.session.store.company, _id: req.body.invoice, customer: req.body.customer, isActive: true},{ $inc: { times_used: 1} },{new: true});
			if(invoice_service.times_used >= invoice_service.times){
				invoice_service.isActive = false;
			}
			if(service.type == "service"){
				log = Log_service({
					createdAt: req.body.time,
					company:req.session.store.company,
					customer:req.body.customer,
					type: "service",
					serial: invoice_service.serial,
					service:req.body.service,
					times_service: service.times_service,
					store:req.session.store._id,
					employees: req.body.employees
				})
			}else{
				log = Log_service({
					createdAt: req.body.time,
					company:req.session.store.company,
					customer:req.body.customer,
					service:req.body.service,
					serial: invoice_service.serial,
					type: "hair_removel",
					service_price: invoice_service.times_used > 10 ? 0 : service.service_price,
					times_service: service.times_service,
					store:req.session.store._id,
					employees: req.body.employees
				})
			}
			
			await log.save()

			invoice_service.log_service.unshift(log._id)
			await invoice_service.save()
			let checkCanEditBill = await Invoice_sale.findOne({company:req.session.store.company, _id:invoice_service.invoice})
			if(checkCanEditBill.isCanBeEdit !== false){
				checkCanEditBill.isCanBeEdit = false
				await checkCanEditBill.save()
			}
			Store_sale.sendMessage(res, "Đã thực hiện thành công");
		}catch(err){
			console.log(err)
			Store_sale.sendError(res, err, err.message);
		}
	}
	static async check_password_manager(req,res){
		try{
			let store = await Store.findOne({company: req.session.store.company, _id: req.session.store._id})
			if (!store.validPassword_manager(req.body.password)){
				req.session.manager = "";
				Store_sale.sendError(res, "Không đúng mật khẩu quản lý", "Nhập lại mật khẩu quản lý");
			}else{
				req.session.manager = req.body.password;
				Store_sale.sendMessage(res, "Đăng nhập quản lý thành công");
			}
		}catch(err){
			console.log(err)
			Store_sale.sendError(res, err, err.message);
		}
	}
	static async report(req, res){
		try{
			let now = new Date();
			let start_day = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0);
			let end_day = new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,0,0,0);
			let start_month = new Date(now.getFullYear(),now.getMonth(),1,0,0,0);
			let end_month = new Date(now.getFullYear(),Number(now.getMonth())+1,1,0,0,0);
			let report_day = await Invoice_sale.aggregate([
				{ $match: {company: mongoose.Types.ObjectId(req.session.store.company), isActive:true,store: mongoose.Types.ObjectId(req.session.store._id), createdAt: {$gte: start_day, $lt: end_day}}},
				{ $group : {
					_id: null,
					totalAmount: { $sum: "$payment" },
					count: { $sum: 1 } // for no. of documents count
					}
				}
			])
			let service_day = await await Log_service.aggregate([
				{ $match: {company: mongoose.Types.ObjectId(req.session.store.company), isActive:true,store: mongoose.Types.ObjectId(req.session.store._id), createdAt: {$gte: start_day, $lt: end_day}}},
				{ $group : {
					_id: null,
					count: { $sum: 1 } // for no. of documents count
					}
				}
			])
			let report_service_month = await Employees.aggregate([
				{ $match: {company: mongoose.Types.ObjectId(req.session.store.company)}},
				{ $lookup:
					 {
					   from: Log_service.collection.name,
					   let: { "pid" : "$_id", "start_month":start_month,"end_month":end_month},
					   pipeline: [
							{ $match:
								 { $expr:
									{ $and:
									   [
										 { $eq: [ "$employees",  "$$pid" ] },
										 { $eq: [ "$type",  "service" ] },
										 { $eq: [ "$isActive",  true ] },
										 { $gte:[ "$createdAt", "$$start_month"]},
										 { $lt: [ "$createdAt", "$$end_month"]},
									   ]
									}
								 }	
							  }
						],
						as: "service_in_month"
					 }
				},
				{ $lookup:
					{
					  from: Log_service.collection.name,
					  let: { "pid" : "$_id", "start_month":start_month,"end_month":end_month},
					  pipeline: [
						   { $match:
								{ $expr:
								   { $and:
									  [
										{ $eq: [ "$employees",  "$$pid" ] },
										{ $eq: [ "$type",  "hair_removel" ] },
										{ $eq: [ "$isActive",  true ] },
										{ $gte:[ "$createdAt", "$$start_month"]},
										{ $lt: [ "$createdAt", "$$end_month"]},
									  ]
								   }
								}	
							 }
					   ],
					   as: "hair_removel_in_month"
					}
			   	},

			])

			let report_sale_month = await Employees.aggregate([
				{ $match: {company: mongoose.Types.ObjectId(req.session.store.company)}},
				{ $lookup:
					 {
					   from: Invoice_sale.collection.name,
					   let: { "pid" : "$_id", "start_month":start_month,"end_month":end_month},
					   pipeline: [
							{ $match:
								 { $expr:
									{ $and:
									   [
										 { $eq: [ "$employees",  "$$pid" ] },
										 { $eq: [ "$isActive",  true ] },
										 { $gte:[ "$createdAt", "$$start_month"]},
										 { $lt: [ "$createdAt", "$$end_month"]},
									   ]
									}
								 }	
							  }
						],
						as: "sale_in_month"
					 }
				},
				{ $unwind:"$sale_in_month"},
				{ $group : {_id:"$_id", name:{ "$first":"$name"}, money_sale:{$sum:"$sale_in_month.payment"}}}
			])
			let employees = await Employees.aggregate([
				{ $match: {company: mongoose.Types.ObjectId(req.session.store.company)}},
				{ $lookup:
					 {
					   from: Invoice_sale.collection.name,
					   let: { "pid" : "$_id", "start_day":start_day,"end_day":end_day},
					   pipeline: [
							{ $match:
								 { $expr:
									{ $and:
									   [
										 { $eq: [ "$employees",  "$$pid" ] },
										 { $eq: [ "$isActive",  true ] },
										 { $gte:[ "$createdAt", "$$start_day"]},
										 { $lt: [ "$createdAt", "$$end_day"]},
									   ]
									}
								 }	
							  }
						],
						as: "sale_in_day"
						}
				},
				{ $unwind:"$sale_in_day"},
				{ $group : {_id:"$_id", name:{ "$first":"$name"}, money_sale:{$sum:"$sale_in_day.payment"}}}
			])
			let cash_book = await Cash_book.find({company: mongoose.Types.ObjectId(req.session.store.company), isActive:true,store: mongoose.Types.ObjectId(req.session.store._id), type: "income", createdAt: {$gte: start_day, $lt: end_day}})
			let money_sales_card = 0;
			let money_sales_cash = 0;
			cash_book.forEach(item=>{
				if(item.type_payment == "card"){
					money_sales_card = money_sales_card+item.money
				}else{
					money_sales_cash = money_sales_cash+item.money
				}
			})
			Store_sale.sendData(res, {report_day, service_day, report_sale_month, report_service_month, employees, money_sales_card, money_sales_cash});
		}catch(err){
			console.log(err)
			Store_sale.sendError(res, err, err.message);
		}
	}
	static async check_out(req, res){
		try{
			//check time
			let time = new Date()
			if (req.body.time && req.session.manager != ""){
				time = req.body.time
			}

			//check price_book 
			if(req.body.price_book != 'default'){
				let date_now = new Date();
				let price_book = await Price_book.findOne({company: req.session.store.company, _id:req.body.price_book, date_from:{$lt: date_now}, date_to:{$gt: date_now}, $or:[{store:[]},{store:req.session.store._id}]})
				if(!price_book){
					return Store_sale.sendError(res, "Đã hết thời gian khuyến mãi", "Vui lòng chọn lại bảng giá khác");
				}
					
			}

			//check employees
			let check_employees = await Employees.findOne({company :req.session.store.company, _id: req.body.employees})
			if(!check_employees) return Store_sale.sendError(res, "Không tìm thấy nhân viên", "Vui lòng kiểm tra lại thông tin");

			//check customer
			let check_customer = ""
			if(req.body.customer){
				check_customer = await Customer.findOne({company: req.session.store.company, _id:req.body.customer})
				if(!check_customer){
					return Store_sale.sendError(res, "Khách hàng không hợp lệ", "Vui lòng kiểm tra lại thông tin");
				}
					
			}

			// check quantity
			if(req.body.list_item == false){
				return Store_sale.sendError(res, "Lỗi chưa chọn sản phẩm - dịch vụ", "Vui lòng chọn lại");
			}

			// main run  
			let list_item = req.body.list_item;
			let temp_convert_data_item = [];
			let list_service = [];
			let list_product = [];
			let payment = 0;
			let payment_back = 0;
			for(let i = 0, list_item_length = list_item.length; i < list_item_length; i++){
				let check_product_service = await Product_service.findOne({company :req.session.store.company, isSale: true, _id:list_item[i].id}).populate({
					path: 'stocks_in_store',
					match: { store_id: req.session.store._id },
					select: 'product_of_sale',
				}).populate({
					path: 'combo.id',
					populate: { path: 'Product_services' },
				});
				if(!check_product_service){
					return Store_sale.sendError(res, `Lỗi sản phẩm [${list_item[i].name}] không tồn tại`, "Vui lòng chọn lại");
				}
				list_item[i] =  Object.assign(list_item[i], check_product_service._doc);

				if(list_item[i].type == 'product' && list_item[i].sell_quantity > list_item[i].stocks_in_store[0].product_of_sale){
					return Store_sale.sendError(res, `Lỗi sản phẩm [${list_item[i].name}] số lượng tồn không đủ`, "Vui lòng chọn lại");
				}else{
					let check_price 

					if(req.session.manager == ""){
						check_price = req.body.price_book != 'default'? check_price_book(list_item[i], req.body.price_book) : list_item[i].price
						list_item[i].price_sale = check_price != list_item[i].price ? check_price : undefined
					}else{
						check_price = Number(list_item[i].price_sell)
						list_item[i].price_sale = Number(list_item[i].price_sell)
					}
					payment += check_price * list_item[i].sell_quantity
					temp_convert_data_item.push({
						id: list_item[i].id, 
						quantity: list_item[i].sell_quantity,
						type: list_item[i].type,
						price: list_item[i].price,
						price_sale: Number(check_price) != Number(list_item[i].price) ? check_price : undefined,
					})
				}

				if(list_item[i].type == 'service' || list_item[i].type == 'hair_removel'){
					for(let k = 0, length = list_item[i].sell_quantity; k < length; k++){
						list_service.push({service: mongoose.Types.ObjectId(list_item[i].id), times: list_item[i].times, name: list_item[i].name})
					}
				}
				if(list_item[i].type == 'product'){
					list_product.push({
						product: mongoose.Types.ObjectId(list_item[i].id),
						quantity: list_item[i].sell_quantity
					})
				}
				if(list_item[i].type == 'combo'){
					list_item[i].combo.forEach(async item =>{
						if(item.id.type == 'service' || item.id.type == 'hair_removel'){
							for(let k = 0, length = list_item[i].sell_quantity *item.quantity; k < length; k++){
								list_service.push({service: mongoose.Types.ObjectId(item.id._id), times: item.id.times, name: item.id.name})
							}
						}else{
							let check_product = await Product_service.findOne({company :req.session.store.company, isSale: true, _id:item.id._id}).populate({
								path: 'stocks_in_store',
								match: { store_id: req.session.store._id },
								select: 'product_of_sale',
							})
							if(list_item[i].sell_quantity *item.quantity > check_product.stocks_in_store[0].product_of_sale){
								return Store_sale.sendError(res, `Lỗi sản phẩm [${list_item[i].name}] số lượng tồn không đủ`, "Vui lòng chọn lại");
							}
							list_product.push({
								product: mongoose.Types.ObjectId(item.id._id),
								quantity: list_item[i].sell_quantity *item.quantity
							})
						}
					})
				}
			}
			//check if have service but not customer
			if(list_service != false && req.body.customer == false){
				return Store_sale.sendError(res, "Để lưu dịch vụ cần phải có thông tin khách hàng", "Vui chọn khách hàng hoặc tạo khách hàng mới");
			}
			//check discount
			let money_discount = 0;
			let check_discount
			if(req.body.discount_id){
				check_discount = await Discount.findOne({company :req.session.store.company, _id: req.body.discount_id, isActive : true})
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
			
			//check payment
			if(req.body.customer_pay_card > payment){
				return Store_sale.sendError(res, `Lỗi thanh toán số tiền chuyển khoản lớn hơn số tiền trả`, "Kiểm tra lại số tiền đã nhập");
			}
			if(req.body.customer_pay_card + req.body.customer_pay_cash < payment){
				return Store_sale.sendError(res, `Lỗi thanh toán chưa đủ số tiền`, "Kiểm tra lại số tiền đã nhập");
			}else{
				payment_back = req.body.customer_pay_card + req.body.customer_pay_cash - payment
			}

			//count discount used
			if(req.body.discount_id){
				check_discount.times_used = check_discount.times_used +1
				await check_discount.save()
			}

			//invoice sale	
			let serial_sale =  await Common.get_serial_store(req.session.store._id, 'BH')
			let serial_stock =  await Common.get_serial_store(req.session.store._id, 'XH')
			let invoice_sale = Invoice_sale({
				serial: serial_sale,
				type : "sale",
				company: req.session.store.company,
				store: req.session.store._id,
				payment_back: payment_back,
				list_item: temp_convert_data_item,
				payment: payment > 0 ? payment : 0,
				employees: req.body.employees,
				customer: req.body.customer != "" ? req.body.customer : undefined,
				discount: req.body.discount_id != "" ? req.body.discount_id : undefined,
				note: req.body.note,
				who_created: req.session.store.name,
				bill:[],
				createdAt: time
			})
			await invoice_sale.save()

			//invoice store stocks
			if(list_product != false){
				let invoice_stock = Invoice_product_store({
					serial: serial_stock,
					type: "sale",
					company: req.session.store.company, 
					store: req.session.store._id, 
					list_products: list_product,
					who_created: req.session.store.name,
					invoice: invoice_sale._id,
					createdAt: time
				})
				
				await invoice_stock.save()
				for (let i = 0; i < list_product.length; i++){
					let store_stocks = await Store_stocks.findOneAndUpdate({company: req.session.store.company, store_id:req.session.store._id, product: list_product[i].product},{$inc:{product_of_sale:Number(list_product[i].quantity)*-1, quantity:Number(list_product[i].quantity)*-1}},{new: true})
					store_stocks.last_history = await Common.last_history(store_stocks.last_history, invoice_stock._id);
					invoice_stock.list_products[i].current_quantity = store_stocks.quantity
					store_stocks.save();
					await Product_service.findOneAndUpdate({company: req.session.store.company, type: "product", _id: list_product[i].product},{$inc:{quantity:Number(list_product[i].quantity)*-1}})
				}
				await invoice_stock.save()
			}

			// create bill
			if(req.body.customer_pay_card && payment > 0){//card
				let serial_card_book = await Common.get_serial_store(req.session.store._id, 'HDTT')
				let card_book = Cash_book({
					serial: serial_card_book,
					type: "income",
					type_payment: "card",
					company:req.session.store.company,
					money: req.body.customer_pay_card,
					isForCompany: false,
					group: "Thanh toán tiền bán hàng",
					user_created: req.session.store.name,
					member_name: check_customer != false ? check_customer.name : "Khách lẻ",
					member_id:check_customer != false ? check_customer._id : undefined,
					accounting: true,
					store: req.session.store._id,
					createdAt: time
				})
				await card_book.save()
				invoice_sale.bill.push(card_book._id)
				await invoice_sale.save()
				if(check_customer != false){
					let customer = await Customer.findOneAndUpdate({company: req.session.store.company, _id: check_customer._id},{$inc:{payment:req.body.customer_pay_card}},{new: true})
					customer.point = Math.trunc(customer.payment / 10000)
					await customer.save()
				}
			}
			if(req.body.customer_pay_cash && payment > 0){//cash
				let money_payment;
				if(req.body.customer_pay_card + req.body.customer_pay_cash > payment){
					money_payment = payment - req.body.customer_pay_card 
				}else{
					money_payment = req.body.customer_pay_cash
				}
				let serial_cash_book = await Common.get_serial_store(req.session.store._id, 'HDTT')
				let cash_book = Cash_book({
					serial: serial_cash_book,
					type: "income",
					type_payment: "cash",
					company:req.session.store.company,
					money: money_payment,
					isForCompany: false,
					group: "Thanh toán tiền bán hàng",
					user_created: req.session.store.name,
					member_name: check_customer != false ? check_customer.name : "Khách lẻ",
					member_id:check_customer != false ? check_customer._id : undefined,
					accounting: true,
					store: req.session.store._id,
					createdAt: time
				})
				await cash_book.save()
				invoice_sale.bill.push(cash_book._id)
				await invoice_sale.save()
				if(check_customer != false){
					let customer = await Customer.findOneAndUpdate({company: req.session.store.company, _id: check_customer._id},{$inc:{payment:money_payment}},{new: true})
					customer.point = Math.trunc(customer.payment / 10000)
					await customer.save()
				}
			}

			// invoice service for customer
			for(let t = 0; t < list_service.length;t++){
				let serial_service = await Common.get_serial_service(req.session.store.company)
				let invoice_service = Invoice_service({
					company: req.session.store.company,
					customer: check_customer != false ? check_customer._id : undefined,
					serial:serial_service,
					times:list_service[t].times,
					service:list_service[t].service,
					invoice: invoice_sale._id,
					createdAt: time
				})
				await invoice_service.save()
				list_service[t].serial = serial_service
			}
			let bill = await Common.print_bill(list_item, list_service, check_customer, req.session.store, check_discount, payment, money_discount, req.body.customer_pay_cash, req.body.customer_pay_card, payment_back, invoice_sale)
			invoice_sale.bill_html = bill
			await invoice_sale.save()
            Store_sale.sendData(res, bill);
		}catch(err){
			console.log(err.message)
			Store_sale.sendError(res, err, err.message);
		}
	}
	static async update_bill(req, res){
		try{
			//check can edit bill
			let check_bill = await Invoice_sale.findOne({company :req.session.store.company,store:req.session.store._id,_id:req.body.id})
			if(check_bill.isCanBeEdit === false){
				return Store_sale.sendError(res, "Lỗi hóa đơn đã được sử dụng dịch vụ", "Không thể chỉnh sửa hóa đơn");
			}
			
			//set time
			let time = req.body.time

			// check quantity
			if(req.body.list_item == false){
				return Store_sale.sendError(res, "Lỗi chưa chọn sản phẩm - dịch vụ", "Vui lòng chọn lại");
			}

			// main run  
			let list_item = req.body.list_item;
			let temp_convert_data_item = [];
			let list_service = [];
			let list_product = [];
			let payment = 0;
			let payment_back = 0;
			for(let i = 0, list_item_length = list_item.length; i < list_item_length; i++){
				let check_product_service = await Product_service.findOne({company :req.session.store.company, isSale: true, _id:list_item[i].id}).populate({
					path: 'stocks_in_store',
					match: { store_id: req.session.store._id },
					select: 'product_of_sale',
				}).populate({
					path: 'combo.id',
					populate: { path: 'Product_services' },
				});
				if(!check_product_service){
					return Store_sale.sendError(res, `Lỗi sản phẩm [${list_item[i].name}] không tồn tại`, "Vui lòng chọn lại");
				}

				// not check enough quantity because this's edit bill will calculate quantity later
				list_item[i] =  Object.assign(list_item[i], check_product_service._doc);

				payment += Number(list_item[i].price_sell) * list_item[i].sell_quantity
				temp_convert_data_item.push({
					id: list_item[i].id, 
					quantity: list_item[i].sell_quantity,
					type: list_item[i].type,
					price: list_item[i].price,
				})


				if(list_item[i].type == 'service' || list_item[i].type == 'hair_removel'){
					for(let k = 0, length = list_item[i].sell_quantity; k < length; k++){
						list_service.push({service: mongoose.Types.ObjectId(list_item[i].id), times: list_item[i].times, name: list_item[i].name})
					}
				}
				if(list_item[i].type == 'product'){
					list_product.push({
						product: mongoose.Types.ObjectId(list_item[i].id),
						quantity: list_item[i].sell_quantity
					})
				}
				if(list_item[i].type == 'combo'){
					list_item[i].combo.forEach(async item =>{
						if(item.id.type == 'service' || item.id.type == 'hair_removel'){
							for(let k = 0, length = list_item[i].sell_quantity *item.quantity; k < length; k++){
								list_service.push({service: mongoose.Types.ObjectId(item.id._id), times: item.id.times, name: item.id.name})
							}
						}else{
							list_product.push({
								product: mongoose.Types.ObjectId(item.id._id),
								quantity: list_item[i].sell_quantity *item.quantity
							})
						}
					})
				}
			}

			//check discount
			let money_discount = 0;
			let check_discount
			if(req.body.discount_id){
				check_discount = await Discount.findOne({company :req.session.store.company, _id: req.body.discount_id, isActive : true})
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
			
			//check payment
			if(req.body.customer_pay_card > payment){
				return Store_sale.sendError(res, `Lỗi thanh toán số tiền chuyển khoản lớn hơn số tiền trả`, "Kiểm tra lại số tiền đã nhập");
			}
			if(req.body.customer_pay_card + req.body.customer_pay_cash < payment){
				return Store_sale.sendError(res, `Lỗi thanh toán chưa đủ số tiền`, "Kiểm tra lại số tiền đã nhập");
			}else{
				payment_back = req.body.customer_pay_card + req.body.customer_pay_cash - payment
			}

			//count discount used
			if(req.body.discount_id){
				check_discount.times_used = check_discount.times_used +1
				await check_discount.save()
			}

			//invoice sale	
			let serial_sale =  await Common.get_serial_store(req.session.store._id, 'BH')
			let serial_stock =  await Common.get_serial_store(req.session.store._id, 'XH')
			let invoice_sale = Invoice_sale({
				serial: serial_sale,
				type : "sale",
				company: req.session.store.company,
				store: req.session.store._id,
				payment_back: payment_back,
				list_item: temp_convert_data_item,
				payment: payment > 0 ? payment : 0,
				employees: req.body.employees,
				customer: req.body.customer != "" ? req.body.customer : undefined,
				discount: req.body.discount_id != "" ? req.body.discount_id : undefined,
				note: req.body.note,
				who_created: req.session.store.name,
				bill:[],
				createdAt: time
			})
			await invoice_sale.save()

			//invoice store stocks
			if(list_product != false){
				let invoice_stock = Invoice_product_store({
					serial: serial_stock,
					type: "sale",
					company: req.session.store.company, 
					store: req.session.store._id, 
					list_products: list_product,
					who_created: req.session.store.name,
					invoice: invoice_sale._id,
					createdAt: time
				})
				
				await invoice_stock.save()
				for (let i = 0; i < list_product.length; i++){
					let store_stocks = await Store_stocks.findOneAndUpdate({company: req.session.store.company, store_id:req.session.store._id, product: list_product[i].product},{$inc:{product_of_sale:Number(list_product[i].quantity)*-1, quantity:Number(list_product[i].quantity)*-1}},{new: true})
					store_stocks.last_history = await Common.last_history(store_stocks.last_history, invoice_stock._id);
					invoice_stock.list_products[i].current_quantity = store_stocks.product_of_sale
					store_stocks.save();
				}
				await invoice_stock.save()
			}

			// create bill
			if(req.body.customer_pay_card && payment > 0){//card
				let serial_card_book = await Common.get_serial_store(req.session.store._id, 'HDTT')
				let card_book = Cash_book({
					serial: serial_card_book,
					type: "income",
					type_payment: "card",
					company:req.session.store.company,
					money: req.body.customer_pay_card,
					isForCompany: false,
					group: "Thanh toán tiền bán hàng",
					user_created: req.session.store.name,
					member_name: check_customer != false ? check_customer.name : "Khách lẻ",
					member_id:check_customer != false ? check_customer._id : undefined,
					accounting: true,
					store: req.session.store._id,
					createdAt: time
				})
				await card_book.save()
				invoice_sale.bill.push(card_book._id)
				await invoice_sale.save()
				if(check_customer != false){
					let customer = await Customer.findOneAndUpdate({company: req.session.store.company, _id: check_customer._id},{$inc:{payment:req.body.customer_pay_card}},{new: true})
					customer.point = Math.trunc(customer.payment / 10000)
					await customer.save()
				}
			}
			if(req.body.customer_pay_cash && payment > 0){//cash
				let money_payment;
				if(req.body.customer_pay_card + req.body.customer_pay_cash > payment){
					money_payment = payment - req.body.customer_pay_card 
				}else{
					money_payment = req.body.customer_pay_cash
				}
				let serial_cash_book = await Common.get_serial_store(req.session.store._id, 'HDTT')
				let cash_book = Cash_book({
					serial: serial_cash_book,
					type: "income",
					type_payment: "cash",
					company:req.session.store.company,
					money: money_payment,
					isForCompany: false,
					group: "Thanh toán tiền bán hàng",
					user_created: req.session.store.name,
					member_name: check_customer != false ? check_customer.name : "Khách lẻ",
					member_id:check_customer != false ? check_customer._id : undefined,
					accounting: true,
					store: req.session.store._id,
					createdAt: time
				})
				await cash_book.save()
				invoice_sale.bill.push(cash_book._id)
				await invoice_sale.save()
				if(check_customer != false){
					let customer = await Customer.findOneAndUpdate({company: req.session.store.company, _id: check_customer._id},{$inc:{payment:money_payment}},{new: true})
					customer.point = Math.trunc(customer.payment / 10000)
					await customer.save()
				}
			}

			// invoice service for customer
			for(let t = 0; t < list_service.length;t++){
				let serial_service = await Common.get_serial_service(req.session.store.company)
				let invoice_service = Invoice_service({
					company: req.session.store.company,
					customer: check_customer != false ? check_customer._id : undefined,
					serial:serial_service,
					times:list_service[t].times,
					service:list_service[t].service,
					invoice: invoice_sale._id,
					createdAt: time
				})
				await invoice_service.save()
				list_service[t].serial = serial_service
			}
			let bill = await Common.print_bill(list_item, list_service, check_customer, req.session.store, check_discount, payment, money_discount, req.body.customer_pay_cash, req.body.customer_pay_card, payment_back, invoice_sale)
			invoice_sale.bill_html = bill
			await invoice_sale.save()
            Store_sale.sendData(res, bill);
		}catch(err){
			console.log(err.message)
			Store_sale.sendError(res, err, err.message);
		}
	}
}

module.exports = Store_sale