// Packages you will need...
const alias = require('../../json/aliases.json');
const punish = require('../../models/punishschema');
const fail = require('../../functions/failure-embed');
const succ = require('../../functions/success-embed');
const MessageEmbed = require('discord.js');
module.exports = {
	help: {
		name: 'rmpunish',
		description: 'Removes a punishment',
		usage: '[punishment ID]',
		aliases: alias.staff.rmpunish,
		category: 'staff',
		cooldown: 15,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['831996400782016563', '831996399209414697', '836583124283686943', '831996396684050443', '831996396151636029'],
		delete: true,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		const data = await punish.findOneAndDelete({ punishID: args[0] });
		if(!data) return message.channel.send(fail('I couldn\'t find a punishment with this ID.'));
		const embed = succ(`Deleted the punishment with ID \`${data.punishID}\``)
			.addField('Case Data', `**Type:** ${data.caseType}\n\n
			**User:** <@${data.userID}>\n\n
			**Moderator:** <@${data.staffID}>\n\n
			**Reason:** ${data.reason}`);
		message.channel.send(embed);
		message.guild.channels.get('851883465364078632').send(new MessageEmbed
			.setTitle('Punishment Removed')
			.addField('Case Data', `**Type:** ${data.caseType}\n\n
			**User:** <@${data.userID}>\n\n
			**Moderator:** <@${data.staffID}>\n\n
			**Reason:** ${data.reason}`)
			.setFooter(`Deleted by: ${message.author.tag}`),
		);
	},
};
