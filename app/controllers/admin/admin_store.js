const Controller = require('../../../core/controller');
const Store = require('../../models/store');
class Admin_store extends Controller{
    static show(req, res){
		console.log(req.session)
        Admin_store.setLocalValue(req,res);
        res.render('./pages/admin/admin_store');
    }
	static async getstore(req, res){
		Store.find({'user_manager.id_admin': req.session.user._id});
	}
}

module.exports = Admin_store