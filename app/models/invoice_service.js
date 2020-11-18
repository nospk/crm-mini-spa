const mongoose = require('mongoose');
const Invoice_service_Schema = mongoose.Schema({	
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
    customer:{
        type: mongoose.Schema.Types.ObjectId, ref:'Customer' 
    },
    serial:{
		type: String, required: true
    },
	service:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Product_services'
	},
	isActive:{
		type: Boolean, default:true 
	},
	status:{
		type: String, // done, cancel, not_used
	},
	who_did:{
		type: mongoose.Schema.Types.ObjectId, ref:'Employees'
	},
	invoice:{
		type: mongoose.Schema.Types.ObjectId, ref:'Invoice_sale'
	},
	times:{
        type: Number
    },
    times_used:{
        type: Number, default: 0
    },
}, { timestamps: true });

module.exports = mongoose.model('Invoice_service', Invoice_service_Schema);