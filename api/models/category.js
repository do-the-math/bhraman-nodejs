const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	date: String,
	count: String	
})

module.exports = mongoose.model('Category', categorySchema);