// Packages you will need...
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'lock',
		description: 'Locks a channel.',
		usage: '(channel) [reason]',
		aliases: alias.staff.lock,
		category: 'staff',
		cooldown: 30,
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
		const reason = args.join(' ');
		let channel = (message.mentions.channels.first() && args[0].startsWith('<#') && args[0].endsWith('>')) ? message.mentions.channels.first() : message.guild.channels.cache.get(args[0]);
		if (!channel) {
			channel = message.channel;
		}
		else {
			args.shift();
		}
		if (!channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')) {
			return message.channel.send(failureEmbed('That channel is already locked.'));
		}
		channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: false });
		if (message.channel.id !== channel.id) {
			message.channel.send(successEmbed(`Locked down ${channel} for \`${reason}\`.`));
		}
		const embed = new MessageEmbed()
			.setTitle('Lockdown')
			.setDescription(`This channel has been locked down for:\n\`${reason}\``)
			.setFooter('Do NOT DM staff members saying you\'re muted, because you\'re not.')
			.setColor('RED');
		channel.send(embed);
	},
};
