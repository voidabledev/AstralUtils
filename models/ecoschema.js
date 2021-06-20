const mongoose = require('mongoose');

const ecoSchema = mongoose.Schema({
	userID: String,
	wallet: Number,
	bank: {
		value: Number,
		capacity: Number,
	},
	items: {},
	level: Number,
	exp: Number,
	lastXP: Number,
});

module.exports = mongoose.model('economy', ecoSchema);