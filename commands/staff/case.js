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
			.setAuthor(message.author.username, message.author.avatarURL())
			.setTitle('Case Information')
			.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
			.addField('Type', foundCase.caseType)
			.addField('Moderator', `<@${foundCase.staffID}> (${foundCase.staffID})`)
			.addField('User', `<@${foundCase.userID}> (${foundCase.userID})`)
			.addField('Reason', foundCase.reason)
			.addField('Time', new Date(foundCase.timestamp).toLocaleString())
			.addField(foundCase.isActive !== false ? 'Expires' : 'Expired', foundCase.expires ? new Date(foundCase.expires).toLocaleString() : 'Not Applicable')
			.setFooter(`Punishment ID: ${foundCase.punishID}`)
			.setColor('RANDOM');
		message.channel.send(embed);
	},
};