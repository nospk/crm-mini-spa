const mongoose = require('mongoose');
const Invoice_product_store_Schema = mongoose.Schema({	
    serial: {
        type: String,required: true
    },
    type:{
        type: String, required: true //import - sale
    },
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
	store:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Stores' 
	},
    list_products:[{
        product: {type: mongoose.Schema.Types.ObjectId, ref:'Product_services'}, 
        quantity: {type: Number},
        current_quantity: {type: Number},
		_id: false
    }],
	who_created:{
		type: String
	},
	invoice:{
		type: mongoose.Schema.Types.ObjectId, ref:'Invoice_sale'
	}
}, { timestamps: true });

module.exports = mongoose.model('Invoice_product_store', Invoice_product_store_Schema);