const mongoose = require('mongoose');
const Brand_group_Schema = mongoose.Schema({	
	type:{
		type: String, require: true // brand - group
	},
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true
	},
	parent_id:{
		type: mongoose.Schema.Types.ObjectId
	},
    name:{
        type: String, require:true
    },
}, { timestamps: true });

module.exports = mongoose.model('Brand_group', Brand_group_Schema);