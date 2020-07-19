const mongoose = require('mongoose');
const Product_Service_Schema = mongoose.Schema({	
	name: {
        type: String,required: true
    },
    type:{
        type: String, required: true
    },
    admin_id:{
        type: mongoose.Schema.Types.ObjectId, required: true
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
		type: Boolean, default:true //0: active, 1: inactive
	},
	isDelete:{
		type: Boolean, default:false //0: active, 1: inactive
	},
	stocks:{
		type: Number, default:0
	},
	stocks_in:[{
		store: {type: mongoose.Schema.Types.ObjectId, ref:'Stores'},
		stock_amount:{	type: Number, default: 0},
		_id: false
	}]
}, { timestamps: true });

module.exports = mongoose.model('Product_services', Product_Service_Schema);