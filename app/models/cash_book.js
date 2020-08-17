const mongoose = require('mongoose');
const Cash_book_Schema = mongoose.Schema({	
    serial: {
        type: String,required: true
    },
    type:{
        type: String, required: true // income - outcome
	},
	group:{
        type: String, required: true // Thanh toán nhà cung cấp - Thanh toán tiền lương - Các khoản khác - Nhận tiền cửa hàng
    },
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
	money:{
		type: Number, required: true
	},
	user_created:{
		type: String, required: true
	},
	member_name:{
		type: String, required: true
	},
	member_id:{
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
	isCostForCompany:{
		type: Boolean, default:true
	},
	store:{
		type: mongoose.Schema.Types.ObjectId, ref:'Stores' 
	},
}, { timestamps: true });

module.exports = mongoose.model('Cash_book', Cash_book_Schema);