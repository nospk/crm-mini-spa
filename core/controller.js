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
			res.redirect('/logout');
		}
	}
}

module.exports = Controller;