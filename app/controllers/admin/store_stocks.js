const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Storage_stocks = require('../../models/storage_stocks');
const Supplier = require('../../models/supplier');
const Invoice_product_storage = require('../../models/invoice_product_storage');
const Common = require("../../../core/common");
class Admin_stocks extends Controller{
    static show(req, res){
        Admin_stocks.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin/store_stocks');
    }
	static async get_product(req, res){
        try{
			let products = await Product_service.find({company: req.session.user.company._id, type: "product", isActive: true, isDelete: false});
			let suppliers = await Supplier.find({company: req.session.user.company._id, isActive: true});
			Admin_stocks.sendData(res, {products, suppliers});
		}catch(err){
			console.log(err)
			Admin_stocks.sendError(res, err, err.message);
        }
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
			let pages = await Invoice_product_storage.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Invoice_product_storage.find(match).skip((pageSize * currentPage) - pageSize).limit(pageSize).populate({
				path: 'supplier',
				populate: { path: 'Suppliers'},
				select: 'name'
			}).populate({
				path: 'list_products.product_id',
				populate: { path: 'Product_services' },
				select: 'number_code'
			});
			Admin_stocks.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err)
			Admin_stocks.sendError(res, err, err.message);
        }
    }
    static async create_new(req, res){
		try{
            const {products} = req.body;
			let list_products = [...products]
			let serial = await Common.get_serial_company(req.session.user.company._id, 'NH')
			list_products.shift()
			let invoice_product_storage = Invoice_product_storage({
				serial: serial,
				type: 'import',
				company: req.session.user.company._id,
				price: products[0].total_get_goods,
				supplier: products[0].supplier,
				list_products: list_products
			});
			await invoice_product_storage.save()
			let supplier = await Supplier.findOne({company: req.session.user.company._id, _id: products[0].supplier})
			supplier.totalMoney = Number(supplier.totalMoney) + Number(products[0].total_get_goods)
			supplier.debt = Number(supplier.debt) + Number(products[0].debt || 0)
			supplier.last_history = await Common.last_history(supplier.last_history, invoice_product_storage._id)
			supplier.save();
            for (let i = 1; i < products.length; i++){
                let find_product = await Product_service.findOne({company: req.session.user.company._id, type: "product", _id: products[i].product_id})
                let cost_price_average = ((Number(find_product.stocks) * Number(find_product.cost_price)) + (Number(products[i].stock_quantity) * Number(products[i].cost_price))) / (Number(find_product.stocks) + Number(products[i].stock_quantity))
                find_product.stocks = Number(find_product.stocks) + Number(products[i].stock_quantity)
                find_product.cost_price = Math.ceil(cost_price_average)
                await find_product.save()
                let store_stocks = await Storage_stocks.findOne({company: req.session.user.company._id, product: products[i].product_id})
				store_stocks.quantity = Number(store_stocks.quantity) + Number(products[i].stock_quantity)
				store_stocks.last_history = await Common.last_history(store_stocks.last_history, invoice_product_storage._id)
				store_stocks.save();
            }
            Admin_stocks.sendMessage(res, "Đã tạo thành công");
		}catch(err){
			console.log(err)
			Admin_stocks.sendError(res, err, err.message);
		}
		
    }
}

module.exports = Admin_stocks