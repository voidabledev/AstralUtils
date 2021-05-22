// Packages you will need...
const alias = require('../../json/aliases.json');

module.exports = {
	name: 'help',
	description: 'Displays the commands',
	aliases: alias.info.help,
	cooldown: 10,
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		// Code here
	},
};
