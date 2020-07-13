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
		type: String, "default": "/dist/image/spa.jpg"
    },
    number_code:{
        type: String
    },
    product:[{
        name: String,
        amount: Number,
        description: String,
        price: Number,
    }], 
    status:{
        type: Number, "default" : 0 //0: active, 1: unactive
    }
}, { timestamps: true });

module.exports = mongoose.model('store', StoreSchema, 'stores');