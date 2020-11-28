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
	combo:[{
		id: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'Product_services'},
		quantity: {type: Number, required:true},
		_id: false
	}],
	price_book:[{
		id: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'Price_book'},
		price_sale: {type: Number, required:true},
		_id: false
	}],
	isSale:{
		type: Boolean, default:true
	},
	brand:{
		type: mongoose.Schema.Types.ObjectId, ref:'Brand_group'
	},
	group:[{
		type: mongoose.Schema.Types.ObjectId, ref:'Brand_group'
	}],
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
	times_service:{
		type: Number
	},
	times:{
        type: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Product_services', Product_Service_Schema);