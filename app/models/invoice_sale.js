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
		type: {type:String, required:true},
        price:{type:Number, required: true},
        price_sale: {type:Number},
		_id: false
    }],
	list_sale_edit:[{
        id: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'Product_services'}, 
        quantity: {type: Number, required: true},
		type: {type:String, required:true},
        price:{type:Number, required: true},
        price_sale: {type:Number},
		_id: false
    }],
    discount:{
        type: mongoose.Schema.Types.ObjectId, ref:'Discount'
    },
    payment:{
        type: Number, require: true
    },
	payment_back:{
		type: Number, require: true
	},
    employees:{
        type: mongoose.Schema.Types.ObjectId, required: true, ref:'Employees' 
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId, ref:'Customer' 
    },
    bill:[{
        type: mongoose.Schema.Types.ObjectId, ref:'Cash_book',
		_id: false		
    }],
	bill_html:{
		type: String, require: true
	},
    who_created:{
		type: String
	},
	edit_times:{
		type: Number, default:0
	},
	note:{
		type: String
	},
	isActive:{
		type: Boolean, default:true 
	},
	isEdit:{
		type: Boolean, default:false 
	},
	
}, { timestamps: true });

module.exports = mongoose.model('Invoice_sale', Invoice_sale_Schema);