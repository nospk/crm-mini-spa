const Controller = require('../../core/controller');


class Login extends Controller{
	
    static async showLogin(req, res) {
		Login.setLocalValue(req,res);
        res.render('./pages/login', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});
    }
	static async adminShowLogin(req, res) {
		Login.setLocalValue(req,res);
        res.render('./pages/adminlogin', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});
    }
}

module.exports = Login