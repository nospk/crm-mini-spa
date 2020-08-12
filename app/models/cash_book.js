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
	who_created:{
		type: String, required: true
	},
	who_receiver:{
		type: String, required: true
	},
	note:{
		type: String
	},
	current_money:{
		type: Number, required: true
	},
	reference:{
		type: mongoose.Schema.Types.ObjectId
	}
}, { timestamps: true });

module.exports = mongoose.model('Cash_book', Cash_book_Schema);