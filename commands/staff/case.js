/* eslint-disable no-unused-vars */
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const punish = require('../../models/punishschema');
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
	help: {
		name: 'case',
		description: 'Show details of a case',
		usage: '[case number]',
		aliases: alias.staff.case,
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
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		const foundCase = await punish.findOne({
			guildID: message.guild.id,
			punishID: args[0],
		});
		if(!foundCase) return message.channel.send(failureEmbed('I couldn\'t find a modlog corresponing to this case.'));
		const embed = new MessageEmbed()
			.setTitle('Case Information')
			.addField('Type', punish.caseType)
			.addField('User', punish.userID)
			.addField('Moderator', `<@${punish.staffID}>`)
			.addField('Time', punish.timestamp)
			.addField('Reason', punish.reason)
			.setFooter(`Punishment ID: ${punish.punishID}`)
			.setColor('GREEN');
		message.channel.send(embed);
	},
};