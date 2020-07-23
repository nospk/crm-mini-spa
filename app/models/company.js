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
	status:{
		type: Number //0: active 1: inactive
	}
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);