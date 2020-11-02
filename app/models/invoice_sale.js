const mongoose = require('mongoose');
const Invoice_sale_Schema = mongoose.Schema({	
    serial: {
        type: String,required: true
    },
    type:{
        type: String, required: true //sale - back
    },
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
	store:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Stores' 
	},
    list_sale:[{
        id: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'Product_services'}, 
        quantity: {type: Number, required: true},
        price:{type:Number, required: true},
		_id: false
    }],
    discount:{
        type: mongoose.Schema.Types.ObjectId, ref:'Discount'
    },
    payment:{
        type: Number, require: true
    },
    employees:{
        type: mongoose.Schema.Types.ObjectId, required: true, ref:'Employees' 
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId, ref:'Customer' 
    },
    bill:[{
        type: mongoose.Schema.Types.ObjectId, ref:'Cash_book' 
    }]
}, { timestamps: true });

module.exports = mongoose.model('Invoice_sale_Schema', Invoice_sale_Schema);