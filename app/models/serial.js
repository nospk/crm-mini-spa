const mongoose = require('mongoose');
const Serial_Schema = mongoose.Schema({	
    product:{
        type: mongoose.Schema.Types.ObjectId, required: true, ref:'Product_services'
    },
    admin_id:{
        type: mongoose.Schema.Types.ObjectId, required: true
    },
    quantity:{
        type: Number, default:0
    },
    last_history:[{
		type: mongoose.Schema.Types.ObjectId
	}]
}, { timestamps: true });

module.exports = mongoose.model('Storage_stocks', Serial_Schema);