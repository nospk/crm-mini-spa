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
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Suppliers' 
	},
    list_products:[{
        name: {type: String},
        product_id: {type: mongoose.Schema.Types.ObjectId, ref:'Product_services'}, 
        stock_quantity: {type: Number},
        cost_price: {type: Number},
		_id: false
    }]
}, { timestamps: true });

module.exports = mongoose.model('Invoice_product_storage', Invoice_product_storage_Schema);