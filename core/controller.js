class Controller {
    static setResponse(req, res){
        this.req = req;
        this.res = res;
    }
    static sendMessage(){
		let json = {
			status : 1,
			error : null,
			message : 'abc',
		}
		this.res.send(json);
	};
}

module.exports = Controller;