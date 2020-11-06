const mongoose = require('mongoose');
const Invoice_product_storage_Schema = mongoose.Schema({	
    serial: {
        type: String,required: true
    },
    type:{
        type: String, required: true //import - transfer
    },
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
	price:{
		type: Number
	},
	supplier:{
		type: mongoose.Schema.Types.ObjectId, ref:'Suppliers' 
    },
    payment:{
        type: mongoose.Schema.Types.ObjectId, ref:'Cash_book'
    },
	store:{
		type: mongoose.Schema.Types.ObjectId, ref:'Stores'
	},
	note:{
		type: String
	},
	who_created:{
		type: String
	},
	invoice_store:{
		type: mongoose.Schema.Types.ObjectId, 
	},
    list_products:[{
        product: {type: mongoose.Schema.Types.ObjectId, ref:'Product_services'}, 
        quantity: {type: Number},
        cost_price: {type: Number},
        current_quantity: {type: Number},
		_id: false
    }]
}, { timestamps: true });

module.exports = mongoose.model('Invoice_product_storage', Invoice_product_storage_Schema);