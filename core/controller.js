const Common = require("./common");
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
		if (req.isAuthenticated() && Common.isset(req.session.store) != null) {
			next();
		} else {
			req.session.destroy();
			res.redirect('/login');
		}
	}
	static loggedInadmin(req, res, next) {
		if (req.isAuthenticated() && Common.isset(req.session.user) != null) {
			next();
		} else {
			req.session.destroy();
			res.redirect('/admin/login');
		}
	}
	//set menu for client
	static setLocalValue(req, res) {
		if(req.session.store){
			res.locals.store_name = 'Cửa hàng ' + req.session.store.name;
			res.locals.menu = "store";
			res.locals.company_name = 'Nospk\'s software'
			res.locals.user_role = "";
			res.locals.logout = "/logout";
		}else{
			if(Common.isset(req.session.store_name) != null){
				res.locals.store_name = 'Cửa hàng ' + req.session.store_name;
			}else{
				res.locals.store_name = ''
			}
			if(Common.isset(req.session.user) != null) {
				res.locals.user_role = req.session.user.role_id;
				res.locals.company_name = req.session.user.company.name
				if(Common.isset(req.session.store_id) != null && req.session.user.role_id == '0'){
					res.locals.menu = "admin";
				}else{
					res.locals.menu = "login";
				}
				res.locals.logout = "/admin/logout";
			} else {
				res.locals.user_role = "";
				res.locals.menu = "";
				res.locals.company_name = 'Nospk\'s software'
			}
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