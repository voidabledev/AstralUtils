/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'notify',
		description: 'Sends a direct message to a user',
		usage: '[user mention or id] [message]',
		aliases: alias.staff.notify,
		category: 'staff',
		cooldown: 10,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: ['ADMINISTRATOR'],
		botPerms: [],
		requiredRoles: [],
		delete: true,
	},
	async execute(message, args, client) {
		const u = message.mentions.users.first() || client.users.cache.get(args[0]);
		const msg = args.slice(1).join(' ');
		if (!u) {
			message.channel
				.send(
					failureEmbed(
						'Please provide a user to DM.',
					),
				);
		}

		try {
			const embed = new MessageEmbed()
				.setTitle('Direct Message')
				.setDescription(`From **${message.guild.name}**\n${msg}`)
				.setFooter(`You were DM'd by ${message.author.tag}`)
				.setTimestamp();
			u.send(embed);
		}
		catch (e) {
			message.channel.send(failureEmbed('I can\'t DM that user.'));
		}
		message.channel.send(
			successEmbed(`I've sent the message to ${u}.`),
		);
	},
};