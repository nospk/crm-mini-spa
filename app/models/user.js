const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');
const UserSchema = mongoose.Schema({	
	name: {
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
    role_id: { type: Number, default: 2 }
});
UserSchema.methods.generateHash = function(password) {
 return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
UserSchema.methods.validPassword = function(password) {
 return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('user', UserSchema, 'users');