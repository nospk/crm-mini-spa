const mongoose = require('mongoose');
const Cash_book_Schema = mongoose.Schema({	
    serial: {
        type: String,required: true
    },
    type:{
        type: String, required: true // income - outcome
    },
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
	money:{
		type: Number, required: true
	},
	who_created_name:{
		type: String, required: true
	},
	who_created_id:{
		type: mongoose.Schema.Types.ObjectId, required: true
	},
	who_receiver_name:{
		type: String, required: true
	},
	who_receiver_id:{
		type: mongoose.Schema.Types.ObjectId, required: true
	},
	note:{
		type: String
	},
	current_money:{
		type: Number, required: true
	},
	reference:{
		type: mongoose.Schema.Types.ObjectId
	},
	cost_for_who:{
		type: String,
	},
	cost_for_company:{
		type: mongoose.Schema.Types.ObjectId, ref:'Company' 
	},
	cost_for_store:{
		type: mongoose.Schema.Types.ObjectId, ref:'Stores' 
	},
}, { timestamps: true });

module.exports = mongoose.model('Cash_book', Cash_book_Schema);