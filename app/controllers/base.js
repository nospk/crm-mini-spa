const Controller = require('../../core/controller');
class Base extends Controller{
    static show(req, res) {
        console.log(req.user)
        res.render('./pages/home');
    }
    static logout(req, res) {
		req.logout();
		res.redirect('/login');
	}
}

module.exports = Base