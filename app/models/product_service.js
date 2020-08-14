const mongoose = require('mongoose');
const Product_Service_Schema = mongoose.Schema({	
	name: {
        type: String,required: true
    },
    type:{
        type: String, required: true
    },
    company:{
        type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company'
    },
	cost_price:{
		type: Number, required: true
	},
	last_cost_price:{
		type: Number
	},
    price: {
        type: Number, required: true
    },
	number_code:{
		type: String, required: true
	},
    description:{
        type: String
    },
	isActive:{
		type: Boolean, default:true 
	},
	isSale:{
		type: Boolean, default:true
	},
	quantity:{
		type: Number
	},
	stocks_in_storage:{
		type: mongoose.Schema.Types.ObjectId, ref:'Storage_stocks'
	},
	stocks_in_store:[{
		type: mongoose.Schema.Types.ObjectId, ref: 'Store_stocks',
		_id: false
	}],
}, { timestamps: true });

module.exports = mongoose.model('Product_services', Product_Service_Schema);