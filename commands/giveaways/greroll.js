/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');

module.exports = {
	help: {
		name: 'greroll',
		description: 'Rerolls a giveaway',
		usage: '[message id]',
		aliases: alias.giveaways.greroll,
		category: 'giveaways',
		cooldown: 10,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['831996436333592586', '851144985800736788'],
		delete: false,
	},
	async execute(message, args, client) {

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
		await client.giveawaysManager.reroll(giveaway.messageID).catch((e) => {
			if (
				e.startsWith(
					`Giveaway with message ID ${giveaway.messageID} is not ended.`,
				)
			) {
				message.channel.send(failureEmbed('This giveaway is not ended!'));
			}
			else {
				throw e;
			}
		});
	},
};