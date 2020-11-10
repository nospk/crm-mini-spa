const mongoose = require('mongoose');
const Price_book_Schema = mongoose.Schema({	
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
	store:{
		type: mongoose.Schema.Types.ObjectId, ref:'Stores' 
	},
	list_product_service:[{
		id: {type: mongoose.Schema.Types.ObjectId, required: true, ref:'Product_services'},
		_id: false
	}]
}, { timestamps: true });

module.exports = mongoose.model('Price_book', Price_book_Schema);