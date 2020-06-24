const Controller = require('../../core/controller');


class Login extends Controller{
	
    static async showLogin(req, res) {
		Controller.setLocalValue(req,res);
        res.render('./pages/login', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});
    }

}

module.exports = Login