const Controller = require('../../../core/controller');
const Store = require('../../models/store');
const Common = require("../../../core/common");
const Product_service = require('../../models/product_service');
const Store_stocks = require('../../models/store_stocks');
const Customer = require('../../models/customer');
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
	static async search_customer(req, res){
        try{
			let match = {
				$and: [ {company :req.session.store.company} ] 
			}
			let customers = await Customer.find(match).sort({createdAt: -1})
			Store_sale.sendData(res, customers);
		}catch(err){
			console.log(err)
			Store_sale.sendError(res, err, err.message);
		}
	}
}

module.exports = Store_sale