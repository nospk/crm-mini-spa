const Controller = require('../../../core/controller');


class AdminLogin extends Controller{
	static show(req, res) {
        AdminLogin.setLocalValue(req,res);
		res.redirect('/admin_store');
    }
	static adminShowLogin(req, res) {
		AdminLogin.setLocalValue(req,res);
        res.render('./pages/admin_manager/adminlogin', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});
    }
	static adminlogout(req, res) {
		req.session.destroy();
		res.redirect('/login');
    }
}

module.exports = AdminLogin