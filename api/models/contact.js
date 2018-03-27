const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	userID: String,
	categoryID: String,
	location: String,
	date: String,
	notes: [{
			date: String,
			note: String
	}],
	position: {
		lat: Number,
		lng: Number
	}
})

module.exports = mongoose.model('Contact', contactSchema);