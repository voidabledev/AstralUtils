// Packages you will need...
const alias = require('../../json/aliases.json');
module.exports = {
	name: String,
	description: String,
	aliases: Array || alias.commandCategory.commandName,
	cooldown: Number,
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		// ...
	},
};