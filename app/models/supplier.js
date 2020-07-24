const mongoose = require('mongoose');
const SuppliersSchema = mongoose.Schema({	
	name: {
        type: String
    },
    address:{
        type: String
    },
	company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
	email:{
		type: String
	},
	phone:{
		type: String
	},
	debt:{
		type: Number, default: 0
	},
	totalMoney:{
		type: Number, default: 0
	},
	isActive:{
		type: Boolean, default:true
	},
	last_history:[{
		type: mongoose.Schema.Types.ObjectId,
		_id: false
	}]
}, { timestamps: true });
module.exports = mongoose.model('Suppliers', SuppliersSchema);