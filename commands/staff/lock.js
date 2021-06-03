// Packages you will need...
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'lock',
		description: 'Locks a channel',
		usage: '[channel mention, channel ID or "here"] (reason)',
		aliases: alias.staff.lock,
		category: 'staff',
		cooldown: 30,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: ['MANAGE_ROLES'],
		botPerms: ['MANAGE_ROLES'],
		requiredRoles: [],
		delete: true,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		const channelID = message.mentions.channels.first() || args.shift();
		const reason = args.join(' ');
		let channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(channelID);
		if (channelID === 'here') channel = message.channel;
		if (!channel) {
			return message.channel.send(
				failureEmbed(
					'You didn\'t provide a valid channel!',
					'Use \'here\' to lock this channel.',
				),
			);
		}
		if (
			!channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
		) {
			return message.channel.send(
				failureEmbed(
					'That channel is already locked.',
				),
			);
		}
		channel.updateOverwrite(message.guild.roles.everyone, {
			SEND_MESSAGES: false,
		});
		if (message.channel.id !== channel.id) {
			message.channel.send(
				successEmbed(
					`Locked down ${channel}`,
				),
			);
		}
		const embed = new MessageEmbed()
			.setTitle('Lockdown')
			.setDescription(`This channel has been locked down for:\n${reason}`)
			.setFooter('Lockdown')
			.setColor('RED');
		channel.send(embed);
	},
};
