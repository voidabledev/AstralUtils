// Packages you will need...
const alias = require('../../json/aliases.json');
// eslint-disable-next-line no-unused-vars
const successEmbed = require('./functions/success-embed');
// eslint-disable-next-line no-unused-vars
const failureEmbed = require('./functions/failure-embed');
module.exports = {
	help: {
		name: String,
		description: String,
		usage: String,
		aliases: alias.commandCategory.commandName,
		cooldown: Number,
	},
	data: {
		minArgs: Number,
		maxArgs: Number || null,
		userPerms: [String],
		botPerms: [String],
		requiredRoles: [String],
		delete: Boolean,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		// Code here
	},
};