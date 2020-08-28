const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Storage_stocks = require('../../models/storage_stocks');
const Supplier = require('../../models/supplier');
const Invoice_product_storage = require('../../models/invoice_product_storage');
const Cash_book = require('../../models/cash_book');
const Common = require("../../../core/common");
class Admin_store_stocks extends Controller{
    static show(req, res){
        Admin_store_stocks.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin_manager/storage_stocks');
    }
	static async get_product(req, res){
        try{
			let products = await Product_service.find({company: req.session.user.company._id, type: "product", isActive: true});
			let suppliers = await Supplier.find({company: req.session.user.company._id, isActive: true});
			Admin_store_stocks.sendData(res, {products, suppliers});
		}catch(err){
			console.log(err)
			Admin_store_stocks.sendError(res, err, err.message);
        }
	}
	static async get_data(req, res){
        try{
			//let {}=req.body
			let match = {
				$and: [ {company :req.session.user.company._id, type: "import"} ] 
			}
			//set default variables
			let pageSize = 10
			let currentPage = req.body.paging_num || 1
	
			// find total item
			let pages = await Invoice_product_storage.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Invoice_product_storage.find(match).sort({createdAt: -1}).skip((pageSize * currentPage) - pageSize).limit(pageSize).populate({
				path: 'supplier',
				populate: { path: 'Suppliers'},
				select: 'name'
			}).populate({
				path: 'list_products.product',
				populate: { path: 'Product_services' },
				select: 'number_code name'
			}).populate({
				path: 'payment',
				populate: { path: 'Cash_book' },
				select: 'money'
			});
			Admin_store_stocks.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err)
			Admin_store_stocks.sendError(res, err, err.message);
        }
    }
    static async create_new(req, res){
		try{
            const {total_get_goods, payment, debt, supplier_id = "", products} = req.body;
			if(supplier_id == ""){
				return Admin_store_stocks.sendError(res, "Lỗi thiếu thông tin", "Vui lòng chọn nhà cung cấp hoặc tạo mới");
			}
			let serial_NH = await Common.get_serial_company(req.session.user.company._id, 'NH')
			let invoice_product_storage = Invoice_product_storage({
				serial: serial_NH,
				type: 'import',
				company: req.session.user.company._id,
				who_created: req.session.user.name,
				price: total_get_goods,
				supplier: supplier_id,
				list_products: products
			});
			await invoice_product_storage.save()
			let supplier = await Supplier.findOne({company: req.session.user.company._id, _id: supplier_id})
			supplier.totalMoney = Number(supplier.totalMoney) + Number(total_get_goods)
			supplier.debt = Number(supplier.debt) + Number(debt)
			supplier.last_history = await Common.last_history(supplier.last_history, invoice_product_storage._id)
			await supplier.save();
			if(Number(payment) > 0){
				let serial_TTCT = await Common.get_serial_company(req.session.user.company._id, 'TTCT')
				let cash_book = Cash_book({
					serial: serial_TTCT,
					type: "outcome",
					company:req.session.user.company._id,
					money: payment,
					current_money: await Common.get_current_money(req.session.user.company._id, (Number(payment) * -1)),
					reference: invoice_product_storage._id,
					isForCompany: true,
					group: 'THANHTNCC',
					user_created: req.session.user.name,
					member_name: supplier.name,
					member_id: supplier._id,
				})
				await cash_book.save()
				invoice_product_storage.payment = cash_book._id
				await invoice_product_storage.save()
			}

            for (let i = 0; i < products.length; i++){
                let find_product = await Product_service.findOne({company: req.session.user.company._id, type: "product", _id: products[i].product})
                let cost_price_average = ((Number(find_product.quantity) * Number(find_product.cost_price)) + (Number(products[i].quantity) * Number(products[i].cost_price))) / (Number(find_product.quantity) + Number(products[i].quantity))
                find_product.quantity = Number(find_product.quantity) + Number(products[i].quantity)
                find_product.cost_price = Math.ceil(cost_price_average)
                await find_product.save()
                let storage_stocks = await Storage_stocks.findOne({company: req.session.user.company._id, product: products[i].product})
				storage_stocks.quantity = Number(storage_stocks.quantity) + Number(products[i].quantity)
				invoice_product_storage.list_products[i].current_quantity = Number(storage_stocks.quantity)
				storage_stocks.last_history = await Common.last_history(storage_stocks.last_history, invoice_product_storage._id)
				storage_stocks.save();
			}
			invoice_product_storage.save()
            Admin_store_stocks.sendMessage(res, "Đã tạo thành công");
		}catch(err){
			console.log(err)
			Admin_store_stocks.sendError(res, err, err.message);
		}
		
    }
}

module.exports = Admin_store_stocks