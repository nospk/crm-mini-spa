const Controller = require('../../../core/controller');


class StoreLogin extends Controller{
    static async showLogin(req, res) {
		StoreLogin.setLocalValue(req,res);
        res.render('./pages/store/login', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});
    }
	static logout(req, res) {
		req.session.destroy();
		res.redirect('/login');
    }
}

module.exports = StoreLogin