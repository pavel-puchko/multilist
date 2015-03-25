
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
	id: String,
	token: String,
	password: String,
	email: String,
	firstName: String,
	lastName: String
})

module.exports = mongoose.model('User',UserSchema);