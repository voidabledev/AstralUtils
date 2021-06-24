const mongoose = require('mongoose');

const ecoSchema = mongoose.Schema({
	userID: String,
	wallet: Number,
	bank: {
		value: Number,
		capacity: Number,
	},
	items: {
		type: Object,
		required: true,
		default: {},
	},
	level: Number,
	exp: Number,
	lastXP: Number,
});

module.exports = mongoose.model('economy', ecoSchema);