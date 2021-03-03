const mongoose = require('mongoose');
const CustomerSchema = mongoose.Schema({	
	name: {
        type: String, required: true
    },
	query_name:{
		type: String,required: true
	},
	birthday:{
		type: String
	},
	phone:{
		type: String, required: true
	},
    address:{
        type: String
    },
	note:{
        type: String
    },
	point:{
		type: Number, default:0
	},
	point_used:{
		type: Number, default:0
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