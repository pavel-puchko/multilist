var mongoose = require('mongoose');

var ItemSchema = mongoose.Schema({
	id: String,
	listId: String,
	itemHeader: String,
	description: String,
	done: Boolean,
	subitems: [{
		subItemHeader: String,
		done: Boolean
	}],
	comments: [{
		commentBody: String,
		createdAt: Date,
		author: String
	}],
	imageUrl: String,
	fileUrl: String,
	expirationDate: String

})

module.exports = mongoose.model('Item', ItemSchema);