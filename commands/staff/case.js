// Packages you will need...
/* eslint-disable no-unused-vars */
const successEmbed = require('./functions/success-embed');
const failureEmbed = require('./functions/failure-embed');
const punish = require('../../models/punishschema');
const { MessageEmbed } = require('discord.js');
module.exports = {
	name: 'case',
	description: 'Show details of a case',
	aliases: ['c'] || global.aliases.mod.case,
	cooldown: 5,
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