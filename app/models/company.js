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
	serial_HH:{
		type: Number, default: 0
	},
	serial_HD:{
		type: Number, default: 0
	},
	serial_DV:{
		type: Number, default: 0
	},
	isActive:{
		type: Boolean, default:true
	}
}, { timestamps: true });

module.exports = mongoose.model('Company', CompanySchema);