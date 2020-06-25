const Controller = require('../../core/controller');
class Base extends Controller{
    static show(req, res) {
        Base.setLocalValue(req,res);
		if(req.session.user.role_id == '0'){
			res.redirect('/admin_store');
		}else{
			res.render('./pages/home');
		}
        
    }
    static logout(req, res) {
		req.session.destroy();
		res.redirect('/login');
    }
}

module.exports = Base