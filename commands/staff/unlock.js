// Packages you will need...
const alias = require('../../json/aliases.json');
const successEmbed = require('./functions/success-embed');
const failureEmbed = require('./functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'unlock',
	description: 'Unlocks a locked channel',
	aliases: ['unl'] || alias.mod.unlock,
	cooldown: 15,
	help: {
		name: 'unlock',
		description: 'Unlocks a locked channel',
		usage: '[channel mention, ID or "here"] (reason)',
		aliases: alias.mod.unlock,
		cooldown: 15,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: ['MANAGE_CHANNELS'],
		botPerms: ['MANAGE_CHANNELS'],
		requiredRoles: [],
		delete: true,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		let channel =
    message.mentions.channels.first() ||
    message.guild.channels.cache.get(args[0]);
		let reason = args.join(' ');
		if (args[0] === 'here') channel = message.channel;

		if (!reason) reason = '`No reason provided`';
		if (!channel) {
			message.channel.send(
				failureEmbed(
					'You didn\'t provide a valid channel!',
					'Use \'here\' to unlock this channel.',
				),
			);
		}
		if (channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) {
			message.channel.send(
				failureEmbed(
					'Failure!',
					'That channel isn\'t locked.',
					'can\'t end something that doesn\'t exist',
					'#7a1b07',
				),
			);
		}
		channel.updateOverwrite(message.guild.roles.everyone, {
			SEND_MESSAGES: true,
		});
		if (message.channel.id !== channel.id) {
			message.channel.send(
				successEmbed(`Unlocked ${channel}.`),
			);
		}
		const embed = new MessageEmbed()
			.setTitle('Lockdown')
			.setDescription(`This channel has been unlocked for:\n${reason}`);
		channel.send(embed);
	},
};
