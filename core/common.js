const Company = require('../app/models/company');
const bcrypt = require('bcrypt-nodejs');
class Common {
	static notEmpty(string){
		if(string !== null && string !== '') 
			return true;
		return false
	}
    static isset(object) {
		if((typeof object == "undefined") || (object == null))
			return null;
		return object;
	};
	static  get_serial_company(id, chartCode){
		return new Promise(async (resolve, reject)=>{
			let company;
            switch(chartCode) {
				case 'NH':
					company = await Company.findOneAndUpdate({_id: id},{$inc:{serial_NH:1}});
					resolve('NH_'+Number(company.serial_NH))
				case 'TT':
					company = await Company.findOneAndUpdate({_id: id},{$inc:{serial_TT:1}});
					resolve('TT_'+Number(company.serial_TT))
				case 'XH':
					company = await Company.findOneAndUpdate({_id: id},{$inc:{serial_XH:1}});
					resolve('XT_'+Number(company.serial_XH))
				default:
					reject(null)
			}			
        })
	}
	static last_history(listArray, item){
		return new Promise(async (resolve, reject)=>{
			if(listArray.length >= 10){
				listArray.pop();
				listArray.unshift(item)
				resolve(listArray)
			}else{
				listArray.unshift(item)
				resolve(listArray)
			}
		})
	}
	static generateHash(password) {
		 return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};

	//checking if password is valid
	static validPassword(password) {
		return bcrypt.compareSync(password, this.password);
	};
}

module.exports = Common;