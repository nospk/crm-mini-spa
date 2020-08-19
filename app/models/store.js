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
	money:{
		type: Number, "default" : 0
	},
	cash:{
		type: Number, "default" : 0
	},
	serial_NK:{
		type: Number, "default" : 1
	},
	serial_TTCT:{
		type: Number, "default" : 1
	},
	serial_TTNT:{
		type: Number, "default" : 1
	},
	serial_HDBH:{
		type: Number, "default" : 1
	},
    isActive:{
		type: Boolean, default:true
	}
}, { timestamps: true });

module.exports = mongoose.model('Stores', StoreSchema);