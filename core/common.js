const Company = require('../app/models/company');
const Store = require('../app/models/store');
const bcrypt = require('bcrypt-nodejs');
const convert_vnd_sting =function(){var t=["Không","Một","Hai","Ba","Bốn","Năm","Sáu","Bảy","Tám","Chín"],r=function(r,n){var o="",a=Math.floor(r/10),e=r%10;return a>1?(o=" "+t[a]+" Mươi",1==e&&(o+=" Mốt")):1==a?(o=" Mười",1==e&&(o+=" Một")):n&&e>0&&(o=" Lẻ"),5==e&&a>=1?o+=" Lăm":4==e&&a>=1?o+=" Tư":(e>1||1==e&&0==a)&&(o+=" "+t[e]),o},n=function(n,o){var a="",e=Math.floor(n/100),n=n%100;return o||e>0?(a=" "+t[e]+" Trăm",a+=r(n,!0)):a=r(n,!1),a},o=function(t,r){var o="",a=Math.floor(t/1e6),t=t%1e6;a>0&&(o=n(a,r)+" Triệu",r=!0);var e=Math.floor(t/1e3),t=t%1e3;return e>0&&(o+=n(e,r)+" Ngàn",r=!0),t>0&&(o+=n(t,r)),o};return{doc:function(r){if(0==r)return t[0];var n="",a="";do ty=r%1e9,r=Math.floor(r/1e9),n=r>0?o(ty,!0)+a+n:o(ty,!1)+a+n,a=" Tỷ";while(r>0);return n.trim()}}}();
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
			let r = await Common.getRandomString(7);
			let company = await Company.findOneAndUpdate({_id: id},{$inc:{serial_DV:1}},{new: true});
			resolve(r +'_'+ company.serial_DV)
		})
	}
	static getRandomString(length) {
		let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for ( let i = 0; i < length; i++ ) {
			result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
		}
		return result;
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
	
	static print_bill(items, service, customer, store, discount, payment, money_discount, cash, card, payment_back, invoice){
		return new Promise(async (resolve, reject)=>{
			let bill = `<html><head><style type="text/css">body {-webkit-print-color-adjust: exact; font-family: Arial; }</style></head><body onload="self.print(); self.close();"><div>
				<style type="text/css">
					.printBox {
						font-family: Arial, sans-serif;
						font-size: 12px;
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
					<table style="width:98%;border-collapse:collapse;border-bottom:1px solid black;">
						<tbody>
							<tr>
								<td rowspan="3"><img src="http://localhost/nospk.png" style="width: 50px;"></td>
								<td style="text-align:center;"><span style="font-size:16px;"><strong>${store.name}</strong></span></td>
							</tr>
							<tr>
								<td style="text-align:center; font-size:14px;">Địa chỉ: ${store.address}</td>
							</tr>
							<tr>
								<td style="text-align:center; font-size:14px;">Số điện thoại: ${store.phone}</td>
								
							</tr>
						</tbody>
					</table>
					<div style="padding:10px 0 15px; text-align:center"><strong style="font-size:12px">HÓA ĐƠN BÁN HÀNG</strong></div>

					<table style="width:100%">
						<tbody>
							<tr>
								<td style="font-size:11px; text-align:center">Số : ${invoice.serial} </td>
							</tr>
							<tr>
								<td style="font-size:11px; text-align:center"> ${new Date(invoice.createdAt).toLocaleString("vi-VN")} </td>
							</tr>
						</tbody>
					</table>

					<table style="margin:10px 0 15px; width:100%">
						<tbody>
							<tr>
								<td style="font-size:11px">Khách hàng: ${customer ? customer.name : ""}</td>
							</tr>
							<tr>
								<td style="font-size:11px">Số điện thoại: ${customer ? customer.phone : ""}</td>
							</tr>
							<tr>
								<td style="font-size:11px">Địa chỉ: ${customer ? customer.address : ""}</td>
							</tr>
							<tr>
								<td style="font-size:11px">Tích điểm: ${customer ? (customer.point - customer.point_used) : ""}</td>
							</tr>
						</tbody>
					</table>

					<table cellpadding="3" style="width:98%;border-collapse: collapse;">
						<tbody>
							<tr style="line-height: 12px;">
								<td style="border-bottom:1px solid black; border-top:1px solid black; width:35%"><strong><span style="font-size:11px">Tên </span></strong></td>
								<td style="border-bottom:1px solid black; border-top:1px solid black; text-align:right; width:30%"><strong><span style="font-size:11px">SL</span></strong></td>
								<td style="border-bottom:1px solid black; border-top:1px solid black; text-align:right"><strong><span style="font-size:11px">Thành tiền</span></strong></td>
							</tr>
				`
				items.forEach(item =>{
					bill+=	`<tr style="line-height: 12px;">
								<td colspan="3" style="padding-top:3px"><span style="font-size:12px">${item.name}</span></td>
							</tr>
							<tr style="line-height: 12px;">
								<td style="border-bottom:1px solid black"><span style="font-size:11px">${String(item.price).replace(/(.)(?=(\d{3})+$)/g,'$1,') + ' ₫'}</span></td>
								<td style="border-bottom:1px solid black; text-align:right"><span style="font-size:11px">${item.sell_quantity}</span></td>
								<td style="border-bottom:1px solid black; text-align:right"><span style="font-size:11px">${String(item.price * item.sell_quantity).replace(/(.)(?=(\d{3})+$)/g,'$1,') + ' ₫'}</span></td>
							</tr>`	
				})
				
				bill+=`		</tbody>
					</table>

					<table border="0" cellpadding="3" cellspacing="0" style="border-collapse:collapse; margin-top:20px; width:98%">
							<tbody><tr>
								<td style="font-size:11px; font-weight:bold; text-align:right; white-space:nowrap">Cộng tiền hàng:</td>
								<td style="font-size:11px; font-weight:bold; text-align:right">${String(payment+money_discount).replace(/(.)(?=(\d{3})+$)/g,'$1,') + ' ₫'}</td>
							</tr>
							<tr>
								<td style="font-size:11px; font-weight:bold; text-align:right; white-space:nowrap">Giảm giá:</td>
								<td style="font-size:11px; font-weight:bold; text-align:right">${String(money_discount).replace(/(.)(?=(\d{3})+$)/g,'$1,') + ' ₫'}</td>
							</tr>
							<tr>
								<td style="font-size:11px; font-weight:bold; text-align:right; white-space:nowrap">Tổng cộng:</td>
								<td style="font-size:11px; font-weight:bold; text-align:right">${String(payment).replace(/(.)(?=(\d{3})+$)/g,'$1,') + ' ₫'}</td>
							</tr>
							<tr>
								<td style="font-size:11px;text-align:right; white-space:nowrap">Tiền khách đưa:</td>
								
							</tr>
							<tr>
								<td style="font-size:11px; font-weight:bold; text-align:right; white-space:nowrap">Tiền mặt : </td>
								<td style="font-size:11px; font-weight:bold; text-align:right">${String(cash).replace(/(.)(?=(\d{3})+$)/g,'$1,') + ' ₫'}</td>
							</tr>
							<tr>
								<td style="font-size:11px; font-weight:bold; text-align:right; white-space:nowrap">Thẻ : </td>
								<td style="font-size:11px; font-weight:bold; text-align:right">${String(card).replace(/(.)(?=(\d{3})+$)/g,'$1,') + ' ₫'}</td>
							</tr>
							<tr>
								<td style="font-size:11px;text-align:right; white-space:nowrap">Tiền thừa:</td>
								<td style="font-size:11px;text-align:right">${String(payment_back).replace(/(.)(?=(\d{3})+$)/g,'$1,') + ' ₫'}</td>
							</tr>
							<tr>
								<td colspan="2" style="font-size:11px; font-style:italic; text-align:left"><em>${convert_vnd_sting.doc(payment)}</em></td>
							</tr>
					</tbody></table>`
				if(service != false){
					bill+= `<table border="0" cellpadding="2" cellspacing="0" style="border-collapse:collapse; margin-top:20px; width:98%">
						<tbody>
						<tr>
								<td style="font-size:11px; font-weight:bold; text-align:left;">Tên dịch vụ</td>
								<td style="font-size:11px; font-weight:bold; text-align:right;">Mã dịch vụ</td>
						</tr>
					`
					service.forEach(item =>{
						bill+=`<tr>
									<td style="font-size:11px; text-align:left;">${item.name}</td>
									<td style="font-size:11px; text-align:right;">${item.serial}</td>
							  </tr>
						`
					})
					bill+= `
						</tbody>
					</table>
					`
					
				}
				bill+=	`<table style="margin-top:20px; width:100%">
						<tbody>
							<tr>
								<td style="font-size:11px; font-style:italic; text-align:center">Cảm ơn và hẹn gặp lại!</td>
							</tr>
							<tr>
								<td style="font-size:11px; text-align:center">Powered by Nospk.dev</td>
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