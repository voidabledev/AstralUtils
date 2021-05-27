// Packages you will need...
const alias = require('../../json/aliases.json');

module.exports = {
	help: {
		name: 'mute',
		description: 'Mutes a member',
		usage: '[user mention or ID] (time) [reason]',
		aliases: alias.staff.mute,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: ['MANAGE_MESSAGES'],
		botPerms: ['MANAGE_ROLES'],
		requiredRoles: [],
		delete: true,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		// Code here
	},
};
