// Packages you will need...
const alias = require('../../json/aliases.json');
// eslint-disable-next-line no-unused-vars
const successEmbed = require('./functions/success-embed');
// eslint-disable-next-line no-unused-vars
const failureEmbed = require('./functions/failure-embed');

module.exports = {
	name: String,
	description: String,
	aliases: Array || alias.commandCategory.commandName,
	cooldown: Number,
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		// Code here
	},
};
