/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const punish = require('../../models/punishschema');

module.exports = {
	help: {
		name: 'warnings',
		description: 'Displays all active warnings of a member.',
		usage: '[User mention or ID] (page)',
		aliases: alias.staff.warnings,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: ['MANAGE_MESSAGES'],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		const target = message.mentions.members.first();
		const id = target ? target.id : args[0];
		const page = parseInt(args[1]) || 1;
		await punish.find({ userID: id, caseType: 'Warn', isActive: true }, (err, warns) => {
			if (err) throw err;
			const maxPage = Math.floor(1 + warns.length / 25);
			if (page > maxPage || page < 1) {
				return message.channel.send(failureEmbed('This page does not exist.'));
			}
			if (!warns.length) {
				return message.channel.send(failureEmbed('That user has no warnings, or you didn\'t provide a valid user.'));
			}
			const embed = new MessageEmbed()
				.setAuthor(client.user.username, client.user.displayAvatarURL())
				.setDescription(`All active warnings for <@${id}>`)
				.setFooter(`Page ${page}/${maxPage}`)
				.setColor('RANDOM');
			const thisPage = warns.filter((l, index) => index >= (page - 1) * 25 && index < page * 25);
			thisPage.forEach((log) => {
				embed.addField(
					`ID: ${log.punishID}`,
					`<@${log.staffID}> - ${log.reason} - ${new Date(log.timestamp).toLocaleString()}`,
				);
			});
			message.channel.send(embed);
		});
	},
};