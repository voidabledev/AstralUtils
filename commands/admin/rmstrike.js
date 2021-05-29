/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');
const strikes = require('../../models/strikeschema');

module.exports = {
	help: {
		name: 'rmstrike',
		description: 'Removes a strike',
		usage: '[Strike ID]',
		aliases: alias.admin.rmstrike,
		category: 'admin',
		cooldown: 5,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: [String],
		botPerms: [String],
		requiredRoles: [String],
		delete: Boolean,
	},
	async execute(message, args, client) {
		const strikeID = args.shift();
		const reason = args.join(' ') || 'No reason provided';
		const strike = await strikes.findOneAndDelete({
			strikeID,
		});
		if (!strike) {
			return message.channel.send(
				failureEmbed('I couldn\'t find a strike associated with this ID!'),
			);
		}
		const logChannel = message.guild.channels.cache.get('831996554763829338');
		const user =
		client.users.cache.get(strike.userId) || client.users.fetch(strike.userId);
		let notifiedUser;
		let deletedMessage;
		user
			? await user
				.send(
					new MessageEmbed()
						.setDescription(
							`Your strike with ID \`${strikeID}\` has been revoked by ${message.author} for \`${reason}\``,
						)
						.setColor('GREEN'),
				)
				.then(() => (notifiedUser = true))
				.catch(() => (notifiedUser = false))
			: (notifiedUser = false);
		await logChannel.messages
			.delete(strike.messageId)
			.then(() => (deletedMessage = true))
			.catch(() => (deletedMessage = false));
		message.channel.send(
			successEmbed(
				`${user} ${
					notifiedUser ? 'has' : 'hasn\'t'
				} been notified. The message in ${logChannel} ${
					deletedMessage ? 'has' : 'hasn\'t'
				} been deleted.`,
				'yay',
			),
		);
	},
};