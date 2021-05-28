/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
module.exports = {
	help: {
		name: 'prune',
		description: 'Deletes a certain amount of messages in a channel',
		usage: '[amount]',
		aliases: alias.staff.prune,
		category: 'staff',
		cooldown: 10,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: ['MANAGE_MESSAGES'],
		botPerms: ['MANAGE_MESSAGES'],
		requiredRoles: [],
		delete: true,
	},
	async execute(message, args, client) {
		const amount = parseInt(args[0], 10) < 100 ? parseInt(args[0], 10) : 99;
		if (isNaN(amount)) message.channel.send(failureEmbed('Please specify the amount of messages you want to delete.'));
		message.channel.bulkDelete(amount + 1).then(() => {
			message.channel
				.send(
					successEmbed(
						`Successfully deleted ${amount} messages.`,
					),
				)
				.then((msg) => {
					setTimeout(() => {
						msg.delete();
					}, 2000);
				});
		});
	},
};