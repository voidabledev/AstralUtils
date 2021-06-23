/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');

module.exports = {
	help: {
		name: 'cas',
		description: 'Pings all active staff members.',
		usage: '',
		aliases: alias.utilities.cas,
		category: 'utilities',
		cooldown: 7200,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		message.channel.send('Are you sure you want to ping ALL the staff members?\n\n**Note:** This would be only usable in emergencies. Say yes or no.').then(async (msg) => {
			await message.channel.awaitMessages((m) => m.author.id === message.author.id, {
				max: 1,
				time: 60000,
				errors: ['time'],
			})
				.then(async (m) => {
					if (m.first().content.toLowerCase().includes('yes')) {
						message.channel.send('<@&831996404549419018>');
					}
					else {
						message.channel.send('Call-all-staff canceled.');
					}
				});
		});
	},
};
