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
	static get_serial_service(id){
		return new Promise(async (resolve, reject)=>{
			let company = await Company.findOneAndUpdate({_id: id},{$inc:{serial_DV:1}},{new: true});
			resolve('MDV_'+ company.serial_DV)
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
	static print_bill(data){
		return new Promise(async (resolve, reject)=>{
			let bill = `<html><head><style type="text/css">body {-webkit-print-color-adjust: exact; font-family: Arial; }</style></head><body onload="self.print(); self.close();"><div>
				<style type="text/css">
					.printBox {
						font-family: Arial, sans-serif;
						font-size: 11px;
						width: 80mm;
					}
					table {
						page-break-inside: auto;
						border-collapse: collapse;
					}

					tr {
						page-break-inside: avoid;
						page-break-after: auto
					}
					@page { size: auto;  margin: 0mm; }
				</style>
				<div class="printBox">
					<table style="width:100%;border-collapse:collapse;border-bottom:1px solid black;">
						<tbody>
							<tr>
								<td rowspan="3"><img src="http://localhost/nospk.png" style="width: 50px;"></td>
								<td style="text-align:center;"><span style="font-size:16px;"><strong>thebeauty</strong></span></td>
							</tr>
							<tr>
								<td style="text-align:center;"></td>
							</tr>
							<tr>
								<td style="text-align:center;">ĐT: 0942222222</td>
							</tr>
						</tbody>
					</table>
					<div style="padding:10px 0 0; text-align:center"><strong style="font-size:12px">HÓA ĐƠN BÁN HÀNG</strong></div>

					<table style="width:100%">
						<tbody>
							<tr>
								<td style="font-size:11px; text-align:center">Số : HD041120-0005 - Bàn : </td>
							</tr>
							<tr>
								<td style="font-size:11px; text-align:center"> 04 / 11 / 2020 - 14 : 41 </td>
							</tr>
						</tbody>
					</table>

					<table style="margin:10px 0 15px; width:100%">
						<tbody>
							<tr>
								<td style="font-size:11px">Khách hàng: </td>
							</tr>
							<tr>
								<td style="font-size:11px">SĐT: </td>
							</tr>
							<tr>
								<td style="font-size:11px">Địa chỉ: </td>
							</tr>
						</tbody>
					</table>

					<table cellpadding="3" style="width:98%;border-collapse: collapse;">
						<tbody>
							<tr style="line-height: 12px;">
								<td style="border-bottom:1px solid black; border-top:1px solid black; width:35%"><strong><span style="font-size:11px">Đơn giá</span></strong></td>
								<td style="border-bottom:1px solid black; border-top:1px solid black; text-align:right; width:30%"><strong><span style="font-size:11px">SL</span></strong></td>
								<td style="border-bottom:1px solid black; border-top:1px solid black; text-align:right"><strong><span style="font-size:11px">Thành tiền</span></strong></td>
							</tr>
							<tr style="line-height: 12px;">
								<td colspan="3" style="padding-top:3px"><span style="font-size:12px">Thuốc Marl blackddddddddddddd ddddddddddddddd dddddddddddd ddddddddddd dddddddd</span></td>
							</tr>
							<tr style="line-height: 12px;">
								<td style="border-bottom:1px solid black"><span style="font-size:11px">21,000 <del></del></span></td>
								<td style="border-bottom:1px solid black; text-align:right"><span style="font-size:11px">1</span></td>
								<td style="border-bottom:1px solid black; text-align:right"><span style="font-size:11px">21,000</span></td>
							</tr>
						</tbody>
					</table>

					<table border="0" cellpadding="3" cellspacing="0" style="border-collapse:collapse; margin-top:20px; width:98%">
							<tbody><tr>
								<td style="font-size:11px; font-weight:bold; text-align:right; white-space:nowrap">Cộng tiền hàng:</td>
								<td style="font-size:11px; font-weight:bold; text-align:right">21,000</td>
							</tr>
							<tr>
								<td style="font-size:11px; font-weight:bold; text-align:right; white-space:nowrap">Chiết khấu:</td>
								<td style="font-size:11px; font-weight:bold; text-align:right">0</td>
							</tr>
							<tr>
								<td style="font-size:11px; font-weight:bold; text-align:right; white-space:nowrap">Tổng cộng:</td>
								<td style="font-size:11px; font-weight:bold; text-align:right">21,000</td>
							</tr>
							<tr>
								<td style="font-size:11px;text-align:right; white-space:nowrap">Tiền khách đưa:</td>
								<td style="font-size:11px;text-align:right">21,000</td>
							</tr>
							<tr>
								<td style="font-size:11px;text-align:right; white-space:nowrap">Tiền thừa:</td>
								<td style="font-size:11px;text-align:right">0</td>
							</tr>
							<tr>
								<td colspan="2" style="font-size:11px; font-style:italic; text-align:left"><em>Hai  mươi mốt  nghìn đồng chẵn</em></td>
							</tr>
					</tbody></table>

					<table style="margin-top:20px; width:100%">
						<tbody>
							<tr>
								<td style="font-size:11px; font-style:italic; text-align:center">Cảm ơn và hẹn gặp lại!</td>
							</tr>
							<tr>
								<td style="font-size:11px; text-align:center">Powered by POS365.VN</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			</body></html>`
			resolve(bill)
		})
	}

}

module.exports = Common;