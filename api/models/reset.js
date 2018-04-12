const mongoose = require('mongoose');

const forgotPasswordLink = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	linkString: String
},
{
    timestamps: true
});

module.exports = mongoose.model('resetlink', forgotPasswordLink);