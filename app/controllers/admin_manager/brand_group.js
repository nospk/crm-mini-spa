const Controller = require('../../../core/controller');
const Product_service = require('../../models/product_service');
const Brand_group = require('../../models/brand_group');
const mongoose = require('mongoose');
class Admin_brand_group extends Controller{
	static async new_brand(req, res){
		try{
			let {name}=req.body
            let check = await Brand_group.findOne({company : req.session.user.company._id, type:'brand', name:name})
			if(check){
                return Admin_brand_group.sendError(res, "Trùng tên này", "Vui lòng chọn tên khác");
			}else{
				let data = Brand_group({
					name: req.body.name,
					query_name: await Common.removeVietnameseTones(req.body.name),
					type: 'brand',
                    company: req.session.user.company._id,
                    list_product:[]
				});
                await data.save()
                Admin_brand_group.sendMessage(res, "Đã tạo thành công");
			}
		}catch(err){
			console.log(err)
			Admin_brand_group.sendError(res, err, err.message);
		}
	}
    static async new_group(req, res){
		try{
			let {name}=req.body
            let check = await Brand_group.findOne({company : req.session.user.company._id, type:'group', name:name})
			if(check){
                return Admin_brand_group.sendError(res, "Trùng tên này", "Vui lòng chọn tên khác");
			}else{
				let data = Brand_group({
					name: req.body.name,
					query_name: await Common.removeVietnameseTones(req.body.name),
					type: 'group',
                    company: req.session.user.company._id,
                    list_product:[]
				});
                await data.save()
                Admin_brand_group.sendMessage(res, "Đã tạo thành công");
			}
		}catch(err){
			console.log(err)
			Admin_brand_group.sendError(res, err, err.message);
		}
    }
    static async get_data(req, res){
        try{
            let data = await Brand_group.find({company: req.session.user.company._id});
			Admin_brand_group.sendData(res, data);
		}catch(err){
			console.log(err)
			Admin_brand_group.sendError(res, err, err.message);
		}
    }
}

module.exports = Admin_brand_group