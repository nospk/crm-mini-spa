const Controller = require('../../core/controller');

class Signup extends Controller{
    static async showSignup(req, res) {
        res.render('./pages/signup', {
			error : req.flash("error"),
			success: req.flash("success"),
			session: req.session
		});
    }

}

module.exports = Signup