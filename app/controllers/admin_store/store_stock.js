const Controller = require('../../../core/controller');
const Store = require('../../models/store');
const Common = require("../../../core/common");
const Product_service = require('../../models/product_service');
const Store_stocks = require('../../models/store_stocks');
const bcrypt = require('bcrypt-nodejs');
class Admin_store_stock extends Controller{
    static show(req, res){
        Admin_store_stock.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin_store/store_stock');
    }
	static async get_data(req, res){
		try{
			let {search}=req.body
			let match = {
				$and: [ {company : mongoose.Types.ObjectId(req.session.user.company._id), isActive: true} ] 
			}
			if(search){
				match.$and.push({$or:[{'number_code': {$regex: search,$options:"i"}},{'name': {$regex: search,$options:"i"}}]})
			}
			//set default variables
			let pageSize = 10
			let currentPage = req.body.paging_num || 1
	
			// find total item
			let pages = await Product_service.find(match).countDocuments()
			// find total pages
			let pageCount = Math.ceil(pages/pageSize)
			let data = await Product_service.aggregate([{$match:match},{$skip:(pageSize * currentPage) - pageSize},{$limit:pageSize}])
			Admin_product_service.sendData(res, {data, pageCount, currentPage});
		}catch(err){
			console.log(err)
			Admin_product_service.sendError(res, err, err.message);
		}
	}
	static async update_stock(req, res){
		try{
			let store = await Store.findOneAndUpdate({company: req.session.user.company._id, _id: req.session.store_id},{$set:{name:req.body.name, address:req.body.address}},{new: true})
			req.session.store_name = store.name;
			Admin_store_stock.sendMessage(res, "Đã cập nhật thành công");
		}catch(err){
			console.log(err.message)
			Admin_store_stock.sendError(res, err, err.message);
		}
		
	}
}

module.exports = Admin_store_stock