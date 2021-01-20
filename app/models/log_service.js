const mongoose = require('mongoose');
const Log_service_Schema = mongoose.Schema({	
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
    customer:{
        type: mongoose.Schema.Types.ObjectId, ref:'Customer' 
    },
	service:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Product_services'
	},
	times_service:{
		type: Number, required: true
	},
	store:{
		type: mongoose.Schema.Types.ObjectId, ref:'Stores' 
	},
	employees:{
		type: mongoose.Schema.Types.ObjectId, ref:'Employees', required: true
	},
	isCount:{
		type: Boolean, default:true 
	},
	isActive:{
		type: Boolean, default:true 
	}
}, { timestamps: true });

module.exports = mongoose.model('Log_service', Log_service_Schema);