const mongoose = require('mongoose');
const DiscountSchema = mongoose.Schema({	
	name: {
        type: String, required: true
    },
    number_code:{
        type: String, required: true
    },
    type:{
        type: String, required: true // limit - unlimit
    },
    type_discount:{
        type:String, required: true //percent - money
    },
    value:{
        type:Number, required: true 
    },
    times:{
        type: Number
    },
    times_used:{
        type: Number, default: 0
    },
	company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	},
	isActive:{
		type: Boolean, default:true
    },
    isDelete:{
		type: Boolean, default:false
    },
}, { timestamps: true });
module.exports = mongoose.model('Discount', DiscountSchema);