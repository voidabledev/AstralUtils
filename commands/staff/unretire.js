/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');

module.exports = {
	help: {
		name: 'unretire',
		description: 'Unretires you.',
		usage: '',
		aliases: alias.staff.unretire,
		category: 'staff',
		cooldown: 86400,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['837431445718695938'],
		delete: true,
	},
	async execute(message, args, client) {
		const { member } = message;
		const reason = args.join(' ');
		message.guild.channels.create(`${member.user.username}-unretire`, {
			type: 'text',
			topic: reason,
			permissionOverwrites: [
				{
					id: message.guild.roles.everyone,
					deny: 'VIEW_CHANNEL',
				},
				{
					id: member.id,
					allow: 'VIEW_CHANNEL',
				},
			],
		})
			.then((channel) => {
				const embed = new MessageEmbed()
					.setTitle('Unretirement')
					.setDescription(`From ${message.author.username}\nFor: \`${reason}\``)
					.setFooter(`User ID: ${member.id}`);
				channel.send(`<@${member.id}> <@&836295798852550686>`, embed);
			});
	},
};