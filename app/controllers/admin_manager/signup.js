const Controller = require('../../../core/controller');

class Signup extends Controller{
    static async adminshowSignup(req, res) {
		Signup.setLocalValue(req,res);
        res.render('./pages/admin_manager/adminsignup', {
			error : req.flash("error"),
			success: req.flash("success"),
			session: req.session
		});
    }

}

module.exports = Signup