const mongoose = require('mongoose');
const Storage_stocks_Schema = mongoose.Schema({	
    product:{
        type: mongoose.Schema.Types.ObjectId, required: true, ref:'Product_services'
    },
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
    quantity:{
        type: Number, default:0
    },
    last_history:[{
		type: mongoose.Schema.Types.ObjectId, ref:'Invoice_product_storage', 
		_id: false
	}]
}, { timestamps: true });

module.exports = mongoose.model('Storage_stocks', Storage_stocks_Schema);