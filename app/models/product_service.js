const mongoose = require('mongoose');
const Product_Service_Schema = mongoose.Schema({	
	name: {
        type: String
    },
    type:{
        type: String
    },
    admin_id:{
        type: mongoose.Schema.Types.ObjectId,
    },
    price: {
        type: Number
    },
	number_code:{
		type: String,
	},
    description:{
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('product_service', Product_Service_Schema, 'product_service');