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
	static loggedInadmin(req, res, next) {
		if (req.isAuthenticated() && req.session.user.role_id == '0') {
			next();
		} else {
			req.session.destroy();
			res.redirect('/login');
		}
	}
	//set menu for client
	static setLocalValue(req, res) {
		if(Common.isset(req.session.store_name) != null){
			res.locals.store_name = 'Cửa hàng ' + req.session.store_name;
		}else{
			res.locals.store_name = ""
		}
		if(Common.isset(req.session.user) != null) {
			res.locals.user_role = req.session.user.role_id;
			if(Common.isset(req.session.store_id) != null && req.session.user.role_id == '0'){
				res.locals.menu = "active";
			}else{
				res.locals.menu = "login";
			}
		} else {
			res.locals.user_role = "";
			res.locals.menu = "";
		}
	}
	static sendError(res, err, msg)	 {
		let json = {
			status : -1,
			error : err,
			message : msg
		}
		res.send(json);	
	};
	static sendMessage(res, msg) {
		let json = {
			status : 1,
			error : null,
			message : msg,
		}
		res.send(json);
	};
	static sendData(res, data) {
		let json = {
			status : 1,
			error : null,
			data: data
		}
		res.json(json);
	}
}

module.exports = Controller;