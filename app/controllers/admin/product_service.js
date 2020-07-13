const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
class Admin_product_service extends Controller{
    static show(req, res){
        Admin_product_service.setLocalValue(req,res);
		//console.log(req.session);
        res.render('./pages/admin/product_service');
    }
	static async get_data(req, res){
		try{
			let data = await Product_service.find({admin_id: req.session.user._id});
			Admin_product_service.sendData(res, data);
		}catch(err){
			console.log(err.message)
			Admin_product_service.sendError(res, err, err.message);
		}
	}
	static async create_new(req, res){
		try{
			let check = await Product_service.findOne({admin_id: req.session.user._id, number_code:req.body.number_code});
			if(check){
				Admin_product_service.sendError(res, "Trùng mã số này", "Vui lòng chọn mã số khác");
			}else{
				let new_product_service = Product_service({
					name: req.body.name,
					type: req.body.type,
					price: req.body.price,
					description: req.body.description,
					number_code: req.body.number_code,
					admin_id: req.session.user._id
				});
				await new_product_service.save()
				Admin_product_service.sendMessage(res, "Đã tạo thành công");
			}
		}catch(err){
			console.log(err.message)
			Admin_product_service.sendError(res, err, err.message);
		}
		
	}
	static async delete_data(req, res){
		try{
			await Product_service.findOneAndRemove({admin_id: req.session.user._id, _id: req.body.id});
			Admin_product_service.sendMessage(res, "Đã xóa thành công");
		}catch(err){
			console.log(err.message)
			Admin_product_service.sendError(res, err, err.message);
		}
	}
}

module.exports = Admin_product_service