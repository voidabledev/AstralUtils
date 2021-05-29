/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');

module.exports = {
	help: {
		name: 'gedit',
		description: 'Edits a giveaway',
		usage: '[message id]',
		aliases: alias.giveaways.gedit,
		category: 'giveaways',
		cooldown: 10,
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
		const messageID = args.shift();
		await client.giveawaysManager
			.edit(messageID, {
				addTime: 5000,
				newPrize: args.join(' '),
			})
			.then(() => {
				const numberOfSecondsMax =
        client.giveawaysManager.options.updateCountdownEvery / 1000;
				message.channel.send(
					'Success! Giveaway will updated in less than ' +
          numberOfSecondsMax +
          ' seconds.',
				);
			})
			.catch((err) => {
				message.channel.send(
					'No giveaway found for ' + messageID + ', please check and try again.',
				);
			});
	},
};