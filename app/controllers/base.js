const Controller = require('../../core/controller');
class Base extends Controller{
    static show(req, res) {
        Controller.setLocalValue(req,res);
        res.render('./pages/home');
    }
    static logout(req, res) {
		req.logout();
		res.redirect('/login');
    }
    static menu(req, res) {

    }
}

module.exports = Base