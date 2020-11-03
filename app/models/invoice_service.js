const mongoose = require('mongoose');
const Invoice_sale_Schema = mongoose.Schema({	
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
	}
	isUsed:{
		type: Boolean, default:false 
	},
	invoice:{
		mongoose.Schema.Types.ObjectId, ref:'Invoice_sale'
	}
}, { timestamps: true });

module.exports = mongoose.model('Invoice_sale_Schema', Invoice_sale_Schema);