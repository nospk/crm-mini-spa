const Controller = require('../../core/controller');
class Base extends Controller{
    static show(req, res) {
        Base.setLocalValue(req,res);
		if(req.session.user){
			res.redirect('/admin_store');
		}else{
			console.log(req.session);
			res.redirect('/store_abc');
		}
        
    }
    static logout(req, res) {
		req.session.destroy();
		res.redirect('/login');
    }
	static adminlogout(req, res) {
		req.session.destroy();
		res.redirect('/admin/login');
    }
}

module.exports = Base