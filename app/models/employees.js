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
	isActive:{
		type: Boolean, default:true
	},
}, { timestamps: true });
module.exports = mongoose.model('Employees', EmployeesSchema);