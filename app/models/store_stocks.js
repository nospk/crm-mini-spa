const mongoose = require('mongoose');
const Store_stocks_Schema = mongoose.Schema({	
    product:{
        type: mongoose.Schema.Types.ObjectId, required: true, ref :'Product_services'
    },
    store_name:{
        type: String, required: true
    },
    store_id:{
        type: mongoose.Schema.Types.ObjectId, required: true,
    },
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
    quantity:{
        type: Number, default:0
    },
	product_of_sell:{
		type: Number, default:0
	},
	product_of_service:{
		type: Number, default:0
	},
	product_of_undefined:{
		type: Number, default:0
	},
    last_history:[{
		type: mongoose.Schema.Types.ObjectId, ref:'Invoice_product_store',
		_id: false
	}]
}, { timestamps: true });

module.exports = mongoose.model('Store_stocks', Store_stocks_Schema);