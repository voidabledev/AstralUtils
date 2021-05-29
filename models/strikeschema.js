const mongoose = require('mongoose');

const strikeSchema = mongoose.Schema({
	userID: String,
	strikeID: String,
	messageID: String,
});

module.exports = mongoose.model('strikes', strikeSchema);