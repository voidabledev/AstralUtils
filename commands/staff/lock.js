// Packages you will need...
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'lock',
	description: 'Locks a channel',
	aliases: ['l'] || alias.mod.lock,
	cooldown: 30,
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		const channelID = args.shift();
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
					'sorry no double lockdown',
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
					'manage channel perms abuse go brrrrrr',
				),
			);
		}
		const embed = new MessageEmbed()
			.setTitle('Lockdown')
			.setDescription(`This channel has been lockdown for:\n${reason}`)
			.setFooter('Lockdown')
			.setColor('RED');
		channel.send(embed);
	},
};
