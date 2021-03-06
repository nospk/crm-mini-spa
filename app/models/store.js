const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
const StoreSchema = mongoose.Schema({	
	name: {
        type: String
    },
    address:{
        type: String
    },
	password_manager:{
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
	active_hash_times: {
		token: String,
		date: Date
    },
	phone:{
		type: String
	},
	serial_HH:{
		type: Number, "default" : 0
	},
	serial_HD:{
		type: Number, "default" : 0
	},
	serial_BH:{
		type: Number, "default" : 0
	},
    isActive:{
		type: Boolean, default:true
	}
}, { timestamps: true });

StoreSchema.methods.validPassword = function(password) {
 return bcrypt.compareSync(password, this.password);
};
StoreSchema.methods.validPassword_manager = function(password) {
 return bcrypt.compareSync(password, this.password_manager);
};

module.exports = mongoose.model('Stores', StoreSchema);