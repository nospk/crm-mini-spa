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
	static async edit_data(req, res){
		try{
			let data = await Product_service.findOne({admin_id: req.session.user._id, _id: req.body.id});
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
	static async update_data(req, res){
		try{
			let find = await Product_service.findOne({admin_id: req.session.user._id, _id: req.body.id});
			if(find){
				let check = await Product_service.findOne({admin_id: req.session.user._id, number_code:req.body.number_code});
				if(check && find.number_code != req.body.number_code){
					return Admin_product_service.sendError(res, "Trùng mã số này", "Vui lòng chọn mã số khác");
				}else{
					find.name = req.body.name;
					find.type = req.body.type;
					find.price = req.body.price;
					find.description = req.body.description;
					find.number_code = req.body.number_code;
					await find.save();
					Admin_product_service.sendMessage(res, "Đã thay đổi thành công");
				}
			}else{
					Admin_product_service.sendError(res, "Không tìm thấy sản phẩm", "Vui lòng thử lại");
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