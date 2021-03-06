const mongoose = require('mongoose');
const Cash_book_Schema = mongoose.Schema({	
    serial: {
        type: String,required: true
    },
    type:{
        type: String, required: true // income - outcome
	},
	type_payment:{
		type: String, required: true // cash - card
	},
	group:{
        type: String, required: true //
    },
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
	money:{
		type: Number, required: true
	},
	money_edit:[{
		type: Number,
		_id: false
	}],
	isEdit:{
		type: Boolean, default:false 
	},
	edit_times:{
		type: Number, default:0
	},
	user_created:{
		type: String, required: true
	},
	member_name:{
		type: String, required: true
	},
	member_id:{
		type: mongoose.Schema.Types.ObjectId
	},
	note:{
		type: String
	},
	reference:{
		type: mongoose.Schema.Types.ObjectId
	},
	isForCompany:{
		type: Boolean, default:false
	},
	accounting:{
		type: Boolean, default:true
	},
	store:{
		type: mongoose.Schema.Types.ObjectId, ref:'Stores' 
	},
	isActive:{
		type: Boolean, default:true 
	}
}, { timestamps: true });

module.exports = mongoose.model('Cash_book', Cash_book_Schema);