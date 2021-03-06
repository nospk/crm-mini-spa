const mongoose = require('mongoose');
const Price_book_Schema = mongoose.Schema({	
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
	name:{
		type: String, required: true
	},
	store:[{
		type: mongoose.Schema.Types.ObjectId, 
		_id: false		
	}],
	list_product_service:[{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Product_services',
		_id: false
	}],
	group_customer:[{
		type: mongoose.Schema.Types.ObjectId,
		_id: false
	}],
	date_from:{
		type: Date, required: true
	},
	date_to:{
		type: Date, required: true
	}
}, { timestamps: true });

module.exports = mongoose.model('Price_book', Price_book_Schema);