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
	isActive:{
		type: String, default:'free'
	},
	serial_NH:{
		type: Number, default: 1
	},
	serial_XH:{
		type: Number, default: 1
	},
	serial_TT:{
		type: Number, default: 1
	},
	money:{
		type: Number, default: 0
	},
	status:{
		type: Number //0: active 1: inactive
	}
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);