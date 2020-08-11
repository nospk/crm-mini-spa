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
	image_store:{
		type: String, "default": "/dist/image/spa.jpg"
    },
    number_code:{
        type: String
    },
	password:{
        type: String
    },
	username: {
        type: String
    },
    active_hash: {
        type: String
    },
	active_hash_times: {
		token: String,
		date: Date
    },
	serial_NK:{
		type: Number, "default" : 1
	},
	serial_TT:{
		type: Number, "default" : 1
	},
	serial_BH:{
		type: Number, "default" : 1
	},
    status:{
        type: Number, "default" : 0 //0: active, 1: unactive
    }
}, { timestamps: true });

module.exports = mongoose.model('Stores', StoreSchema);