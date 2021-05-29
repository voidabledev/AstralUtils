/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');

module.exports = {
	help: {
		name: 'gdelete',
		description: 'Removes a giveaway entirely without determining a winner',
		usage: '[message ID]',
		aliases: alias.giveaways.gdelete,
		category: 'giveaways',
		cooldown: 15,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['831996436333592586'],
		delete: false,
	},
	async execute(message, args, client) {
		await client.giveawaysManager
			.delete(args[0])
			.then(() => {
				message.channel.send(successEmbed('Giveaway deleted!'));
			})
			.catch(() => {
				message.channel.send(
					failureEmbed(`No giveaway found for ${args[0]}, please check and try again.`),
				);
			});
	},
};