// Packages you will need...
/* eslint-disable no-unused-vars */
const successEmbed = require('./functions/success-embed');
const failureEmbed = require('./functions/failure-embed');
const punish = require('../../models/punishschema');
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
	help: {
		name: 'case',
		description: 'Show details of a case',
		usage: '[case number]',
		aliases: alias.mod.case,
		cooldown: 5,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: ['MANAGE_MESSAGES'],
		botPerms: [],
		requiredRoles: [],
		delete: true,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		const foundCase = await punish.findOne({
			guildID: message.guild.id,
			punishID: args[0],
		});
		if(!foundCase) return message.channel.send(failureEmbed('I couldn\'t find a modlog corresponing to this case.'));
		const embed = new MessageEmbed()
			.setTitle(`Case #${args[0]}`)
			.addField('Punishment type', punish.typeCase)
			.addField('Moderator');
	},
};