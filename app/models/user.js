const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
const UserSchema = mongoose.Schema({	
	username: {
        type: String
    },
    address:{
        type: String
    },
    password:{
        type: String
    },
    active_hash: {
        type: String
    },
	active_hash_times: {
		token: String,
		date: Date
    },
	status:{
		type: Number //0: active 1: inactive
	},
    role_id: { type: Number, default: 1} //0: admin, 1:manager
}, { timestamps: true });
UserSchema.methods.generateHash = function(password) {
 return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
UserSchema.methods.validPassword = function(password) {
 return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('user', UserSchema, 'users');