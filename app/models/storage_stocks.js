const mongoose = require('mongoose');
const Stocks_Schema = mongoose.Schema({	
	serial: {
        type: String,required: true
    },
    type:{
        type: String, required: true //import - transfer
    },
    admin_id:{
        type: mongoose.Schema.Types.ObjectId, required: true
    },
    store_receive:{
        type: mongoose.Schema.Types.ObjectId, ref:'Store'
    },
    list_products:[{
        name: {type: String},
        product_id: {type: mongoose.Schema.Types.ObjectId, ref:'Product_services'}, 
        stock_quantity: {type: Number},
        cost_price: {type: Number}
    }]
}, { timestamps: true });

module.exports = mongoose.model('Stocks', Stocks_Schema);