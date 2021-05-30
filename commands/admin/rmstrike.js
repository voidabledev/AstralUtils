/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');
const strikeSchema = require('../../models/strikeschema');

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
		userPerms: [],
		botPerms: [],
		requiredRoles: ['836583124283686943', '831996396684050443', '831996396151636029'],
		delete: true,
	},
	async execute(message, args, client) {
		const strikeID = args.shift();
		const reason = args.join(' ') || 'No reason provided';
		const strike = await strikeSchema.findOneAndDelete({
			strikeID,
		});
		if (!strike) {
			return message.channel.send(
				failureEmbed('I couldn\'t find a strike associated with this ID!'),
			);
		}
		const logChannel = message.guild.channels.cache.get('831996554763829338');
		const user = await client.users.fetch(strike.userID);
		const id = user.id;
		if (id === message.author.id) message.channel.send(failureEmbed('You can\'t strike yourself.'));
		if (id === client.user.id) message.channel.send(failureEmbed('You can\'t strike me.'));
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
			.delete(strike.messageID)
			.then(() => (deletedMessage = true))
			.catch(() => (deletedMessage = false));
		message.channel.send(
			successEmbed(
				`${user} ${
					notifiedUser ? 'has' : 'hasn\'t'
				} been notified. The message in ${logChannel} ${
					deletedMessage ? 'has' : 'hasn\'t'
				} been deleted.`,
			),
		);
	},
};