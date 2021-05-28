/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');

module.exports = {
	help: {
		name: 'gend',
		description: 'Ends a giveaway',
		usage: '[message id]',
		aliases: alias.giveaways.gend,
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

		if (!args[0]) {
			return message.channel.send(
				failureEmbed('You have to specify a message ID!'),
			);
		}

		const giveaway =
    (await client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' '),
    )) ||
    (await client.giveawaysManager.giveaways.find((g) => g.messageID === args[0],
    ));

		if (!giveaway) {
			return message.channel.send(
				'Unable to find a giveaway for `' + args.join(' ') + '`.',
			);
		}

		await client.giveawaysManager
			.edit(giveaway.messageID, {
				setEndTimestamp: Date.now(),
			})
			.then(() => {
				message.channel.send(
					'Giveaway will end in less than ' +
          client.giveawaysManager.options.updateCountdownEvery / 1000 +
          ' seconds...',
				);
			})
			.catch((e) => {
				if (
					e.startsWith(
						`Giveaway with message ID ${giveaway.messageID} is already ended.`,
					)
				) {
					message.channel.send('This giveaway is already ended!');
				}
				else {
					console.error(e);
					message.channel.send('An error occured...');
				}
			});
	},
};