const Controller = require('../../core/controller');
class HomePage extends Controller{
    static async show(req, res) {
        HomePage.setResponse(req, res);
        HomePage.sendMessage();
    }

}

module.exports = HomePage