const mongoose = require('mongoose');
const Product_brand_Schema = mongoose.Schema({	
    list_product:[{
        type: mongoose.Schema.Types.ObjectId, required: true, ref:'Product_services'
    }],
	type:{
		type: string, require: true // brand - group
	},
    company:{
		type: mongoose.Schema.Types.ObjectId, required: true
	},
	parent_id:{
		type: mongoose.Schema.Types.ObjectId
	},
    name:{
        type: string, require:true
    },
}, { timestamps: true });

module.exports = mongoose.model('Product_brand', Product_brand_Schema);