const mongoose = require('mongoose');
const CustomerSchema = mongoose.Schema({	
	name: {
        type: String, required: true
    },
	birthday:{
		type: String, required: true
	},
	phone:{
		type: String, required: true
	},
    address:{
        type: String, required: true
    },
	note:{
        type: String
    },
	payment:{
		type: Number, default:0
	},
	debt:{
		type: Number, default:0
	},
	gener:{
		type: String
	},
	company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
	isActive:{
		type: Boolean, default:true
	},
}, { timestamps: true });
module.exports = mongoose.model('Customer', CustomerSchema);