const Company = require('../app/models/company');
const Store = require('../app/models/store');
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
	static get_serial_company(id, chartCode){
		return new Promise(async (resolve, reject)=>{
			let company;
            switch(chartCode) {
				case 'NH':
					company = await Company.findOneAndUpdate({_id: id},{$inc:{serial_HH:1}},{new: true});
					resolve('HHNH_'+Number(company.serial_HH));
					break; 
				case 'XH':
					company = await Company.findOneAndUpdate({_id: id},{$inc:{serial_HH:1}},{new: true});
					resolve('HHXH_'+Number(company.serial_HH));
					break;
				case 'HDCT':
					company = await Company.findOneAndUpdate({_id: id},{$inc:{serial_HD:1}},{new: true});
					resolve('HDCT_'+Number(company.serial_HD));
					break; 
				case 'HDTT':
					company = await Company.findOneAndUpdate({_id: id},{$inc:{serial_HD:1}},{new: true});
					resolve('HDTT_'+Number(company.serial_HD));
					break; 
				default:
					reject(null);
					break; 
			}			
        })
	}
	static get_current_money(id, money){
		return new Promise(async (resolve)=>{
			let company = await Company.findOne({_id: id});
			company.money = Number(company.money) + Number(money)
			company.save()
			resolve(company.money)
		})
	}
	static get_current_money_store(company, id, money){
		return new Promise(async (resolve)=>{
			let store = await Store.findOne({company : company,_id: id});
			store.money = Number(store.money) + Number(money)
			store.save()
			resolve(store.money)
		})
	}
	static get_serial_store(id, chartCode){
		return new Promise(async (resolve, reject)=>{
			let store;
            switch(chartCode) {
				case 'NH':
					store = await Store.findOneAndUpdate({_id: id},{$inc:{serial_HH:1}},{new: true});
					resolve('HHNH_'+Number(store.serial_HH));
					break; 
				case 'XH':
					store = await Store.findOneAndUpdate({_id: id},{$inc:{serial_HH:1}},{new: true});
					resolve('HHXH_'+Number(store.serial_HH));
					break; 
				case 'HDCT':
					store = await Store.findOneAndUpdate({_id: id},{$inc:{serial_HD:1}},{new: true});
					resolve('HDCT_'+Number(store.serial_HD));
					break; 
				case 'HDTT':
					store = await Store.findOneAndUpdate({_id: id},{$inc:{serial_HD:1}},{new: true});
					resolve('HDTT_'+Number(store.serial_HD));
					break;
				case 'BH':
					store = await Store.findOneAndUpdate({_id: id},{$inc:{serial_BH:1}},{new: true});
					resolve('HDBH_'+Number(store.serial_BH));
					break;
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

}

module.exports = Common;