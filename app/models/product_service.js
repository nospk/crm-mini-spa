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
	}
}, { timestamps: true });

module.exports = mongoose.model('product_service', Product_Service_Schema, 'product_service');