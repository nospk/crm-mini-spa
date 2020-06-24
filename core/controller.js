let Common = require("./common");
class Controller {
    static sendMessage(res, msg){
		let json = {
			status : 1,
			error : null,
			message : msg,
		}
		res.send(json);
	};


	static loggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.redirect('/login');
		}
	}

	//set menu for client
	static setLocalValue(req, res) {
		if(Common.isset(req.session.user) != null) { 
			res.locals.user_role = req.session.user.role_id;
			res.locals.menu = "login";
		} else {
			res.locals.user_role = "";
			res.locals.menu = "";
		}
	}
}

module.exports = Controller;