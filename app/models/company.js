const mongoose = require('mongoose');
const CompanySchema = mongoose.Schema({	
	name: {
        type: String
    },
	name_account:{
		type: String
	},
	total_user:{
		type: Number
	},
	type:{
		type: String, default:'free'
	},
	cash:{
		type: Number, default: 0
	},
	serial_NH:{
		type: Number, default: 0
	},
	serial_XH:{
		type: Number, default: 0
	},
	serial_TTCT:{
		type: Number, default: 0
	},
	serial_TTNT:{
		type: Number, default: 0
	},
	money:{
		type: Number, default: 0
	},
	isActive:{
		type: Boolean, default:true
	}
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);