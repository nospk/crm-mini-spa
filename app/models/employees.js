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
    identity_number:{
        type: String
    },
	company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
	status:{
		type: Number, default:0 //0: active 1: inactive
	},
}, { timestamps: true });
module.exports = mongoose.model('Employees', EmployeesSchema);