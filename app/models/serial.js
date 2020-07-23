const mongoose = require('mongoose');
const Serial_Schema = mongoose.Schema({	
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true, ref:'Company' 
	}
}, { timestamps: true });

module.exports = mongoose.model('Storage_stocks', Serial_Schema);