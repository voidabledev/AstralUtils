// Packages you will need...
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'unlock',
	description: 'Unlocks a locked channel',
	aliases: alias.staff.unlock,
	cooldown: 15,
	help: {
		name: 'unlock',
		description: 'Unlocks a locked channel',
		usage: '(channel) [reason]',
		aliases: alias.staff.unlock,
		category: 'staff',
		cooldown: 15,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: ['BAN_MEMBERS'],
		botPerms: ['MANAGE_CHANNELS'],
		requiredRoles: [],
		delete: true,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		let channel =
    message.mentions.channels.first() ||
    message.guild.channels.cache.get(args[0]);
		if (!channel) {
			channel = message.channel;
		}
		else {
			args.shift();
		}
		const reason = args.join(' ');
		if (channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) {
			message.channel.send(failureEmbed('That channel isn\'t locked.'));
		}
		channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: true });
		if (message.channel.id !== channel.id) {
			message.channel.send(successEmbed(`Unlocked ${channel} for \`${reason}\`.`));
		}
		const embed = new MessageEmbed()
			.setTitle('Lockdown')
			.setDescription(`This channel has been unlocked for:\n\`${reason}\``)
			.setColor('GREEN');
		channel.send(embed);
	},
};
