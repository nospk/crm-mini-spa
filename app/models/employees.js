const mongoose = require('mongoose');
const EmployeesSchema = mongoose.Schema({	
	name: {
        type: String
    },
	birthday:{
		type: String
	},
	number_code:{
		type: String
	},
    address:{
        type: String
    },
	gener:{
		type: String
	},
    identity_number:{
        type: String
    },
	number_service:{
        type: Number
    },
	number_sales:{
        type: Number
    },
	company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
	store:{
		type: mongoose.Schema.Types.ObjectId, ref:'Stores' 
	},
	isActive:{
		type: Boolean, default:true
	},
}, { timestamps: true });
module.exports = mongoose.model('Employees', EmployeesSchema);