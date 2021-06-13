/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const punish = require('../../models/punishschema');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'modlogs',
		description: 'Displays all punishments for a user',
		usage: '[mention or id] (page)',
		aliases: alias.staff.modlogs,
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
		await punish.find({ userID: id }, (err, logs) => {
			if (err) throw err;
			const maxPage = Math.floor(1 + logs.length / 25);
			if (page > maxPage || page < 1) {
				return message.channel.send(failureEmbed('This page does not exist.'));
			}
			if (!logs.length) {
				return message.channel.send(failureEmbed('That user has no punishments, or you didn\'t provide a valid user.'));
			}
			const embed = new MessageEmbed()
				.setAuthor(client.user.username, client.user.displayAvatarURL())
				.setDescription(`All the modlogs for <@${id}>`)
				.setFooter(`Page ${page}/${maxPage}`)
				.setColor('RANDOM');
			const thisPage = logs.filter((l, index) => index >= (page - 1) * 25 && index < page * 25);
			thisPage.forEach((log) => {
				embed.addField(
					`ID: ${log.punishID} | Type: ${log.caseType}`,
					`<@${log.staffID}> - ${log.reason}\nCreated: ${new Date(log.timestamp).toLocaleString()}\n${
						log.expires ? (
							(log.isActive !== false ? 'Expires: ' : 'Expired: ') +
							new Date(log.expires).toLocaleString()
						) : ''
					}`,
				);
			});
			message.channel.send(embed);
		});
	},
};