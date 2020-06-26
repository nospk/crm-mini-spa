const mongoose = require('mongoose');
const StoreSchema = mongoose.Schema({	
	name: {
        type: String
    },
    address:{
        type: String
    },
    user_manager:{
        id_admin: mongoose.Schema.Types.ObjectId,
        id_mananger: mongoose.Schema.Types.ObjectId
    },
    money_in_month: {
        type: Number
    },
	image_store:{
		type: String
	},
    product:[{
        name: String,
        amount: Number,
        description: String,
        price: Number,
    }]
});

module.exports = mongoose.model('store', StoreSchema, 'stores');