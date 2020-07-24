const Company = require('../app/models/company');
class Common {
    static isset(object) {
		if((typeof object == "undefined") || (object == null))
			return null;
		return object;
	};
	static  get_serial_company(id, chartCode){
		return new Promise(async (resolve, reject)=>{
            if(chartCode == 'NH'){
				let company = await Company.findOneAndUpdate({_id: id},{$inc:{serial_NH:1}});
				resolve('NH_'+Number(company.serial_NH))
			}else{
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
}

module.exports = Common;