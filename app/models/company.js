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
	isActive:{
		type: Boolean, default:true
	}
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);