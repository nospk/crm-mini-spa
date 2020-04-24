const Controller = require('../../core/controller');


class Login extends Controller{
    static async showLogin(req, res) {
        res.render('./pages/login');
    }

}

module.exports = Login