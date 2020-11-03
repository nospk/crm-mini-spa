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
	isUsed:{
		type: Boolean, default:false 
	},
	who_did:{
		type: mongoose.Schema.Types.ObjectId, ref:'Employees'
	},
	invoice:{
		type: mongoose.Schema.Types.ObjectId, ref:'Invoice_sale'
	}
}, { timestamps: true });

module.exports = mongoose.model('Invoice_service', Invoice_service_Schema);