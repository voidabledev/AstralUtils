/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const punish = require('../../models/punishschema');

module.exports = {
	help: {
		name: 'warns',
		description: 'Displays all active warnings of a member, or yourself.',
		usage: '(mention or id)',
		aliases: alias.staff.warnings,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		const target = args[0] ? message.mentions.users.first() || await client.users.fetch(args[0]) : message.author;
		const { id } = target;
		const selfCheck = id === message.author.id && !message.member?.hasPermission('MANAGE_MESSAGES');
		if (id !== message.author.id && !message.member?.hasPermission('MANAGE_MESSAGES')) return message.channel.send(failureEmbed('You can\'t check warnings for other members!'));
		await punish.find({ userID: id, caseType: 'Warn', isActive: true }, (err, warns) => {
			if (err) throw err;
			if (!warns.length) {
				return message.channel.send(failureEmbed(id === message.author.id ? 'You have no warnings.' : 'That user has no warnings, or you didn\'t provide a valid user.'));
			}
			const embed = new MessageEmbed()
				.setAuthor(client.user.username, client.user.displayAvatarURL())
				.setDescription(`All active warnings for <@${id}>`)
				.setFooter(`User ID: ${id}`)
				.setColor('RANDOM');
			warns.forEach((log) => {
				embed.addField(
					selfCheck ? `<t:${Math.floor(log.timestamp / 1000)}:R>` : `ID: ${log.punishID}`,
					selfCheck ? log.reason : `<@${log.staffID}> - ${log.reason} - <t:${Math.floor(log.timestamp / 1000)}:R>`,
				);
			});
			message.channel.send(embed);
		});
	},
};