const Controller = require('../../core/controller');

class Signup extends Controller{
    static async showSignup(req, res) {
        res.render('./pages/signup');
    }

}

module.exports = Signup