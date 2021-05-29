/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'dm',
		description: 'Sends a direct message to a user',
		usage: '[user mention or ID] [message]',
		aliases: alias.commandCategory.commandName,
		category: 'admin',
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
						'doesn\'t know even how to use a dm cmd',
					),
				)
				.then((m) => {
					m.delete({ timeout: 10000 });
					message.delete({ timeout: 10000 });
				});
			return;
		}

		try {
			const embed = new MessageEmbed()
				.setTitle('Direct Message')
				.setDescription(`From **${message.guild.name}**\n${msg}`)
				.setFooter(`You were direct messaged by ${message.author.username}`);
			u.send(embed);
		}
		catch (e) {
			message.channel.send(failureEmbed('I can\'t DM that user.', 'lol'));
		}

		message.channel.send(
			successEmbed(`I've sent the message to ${u}`, 'you learned!'),
		);
	},
};