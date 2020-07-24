const mongoose = require('mongoose');
const StoreSchema = mongoose.Schema({	
	name: {
        type: String
    },
    address:{
        type: String
    },
    user_manager:{
        mananger_id: mongoose.Schema.Types.ObjectId
    },
	company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
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
        quantity: Number,
        description: String,
        price: Number,
    }],
	serial_TT:{
		type: Number
	},
	serial_BH:{
		type: Number
	},
    status:{
        type: Number, "default" : 0 //0: active, 1: unactive
    }
}, { timestamps: true });

module.exports = mongoose.model('Stores', StoreSchema);