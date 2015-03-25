
var mongoose = require('mongoose');

var ListSchema = mongoose.Schema({
	id: String,
	listHeader: String,
	owner: String,
	users: [String],
	items: Array
})

module.exports = mongoose.model('List', ListSchema);