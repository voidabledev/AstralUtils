/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const punish = require('../../models/punishschema');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'modlogs',
		description: 'Displays all modlogs for a user',
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
		const target =
    message.mentions.members.first() ||
    (await message.guild.members.fetch(args[0]));
		if(!target) return message.channel.send(failureEmbed('Please specify someone to check punishments for!'));
		const page = parseInt(args[1]) || 1;
		await punish.find({ userID: target.id }, (err, logs) => {
			if(err) throw err;
			const maxPage = Math.floor(1 + logs.length / 25);
			if(page > maxPage || page < 1) return message.channel.send(failureEmbed('This page does not exist!'));
			if(logs.length === 0) {
				const em = new MessageEmbed()
					.setTitle(`Modlogs for ${target.user.username}`)
					.setDescription('This user doesn\'t have any modlogs.')
					.setFooter(`User ID: ${target.id}`)
					.setColor('ORANGE');
				return message.channel.send(em);
			}
			const embed = new MessageEmbed()
				.setTitle(`Modlogs for ${target.user.username}`)
				.setFooter(`User ID: ${target.id} | Page ${page}/${maxPage}`)
				.setColor('RANDOM');
			const thisPage = logs.filter((l, index) => index >= (page - 1) * 25 && index < page * 25);
			thisPage.forEach((log) => {
				embed.addField(
					`${log.caseType} on ${new Date(log.timestamp).toLocaleDateString()}`,
					`**Moderator:** <@${log.staffID}>\n**Reason:** ${log.reason}\n**Exact Date:** ${
						new Date(log.timestamp).toLocaleString()
					}\n**Expires:** ${
						log.expires ? new Date(log.expires).toLocaleString() : 'No'
					}\n**Punishment ID:** ${log.punishID}`,
				);
			});
			message.channel.send(embed);
		});
	},
};