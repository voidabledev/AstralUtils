// Packages you will need...
const alias = require('../../json/aliases.json');
const punish = require('../../models/punishschema');
const fail = require('../../functions/failure-embed');
const succ = require('../../functions/success-embed');
module.exports = {
	help: {
		name: 'rmpunish',
		description: 'Removes a punishment',
		usage: '[punishment ID]',
		aliases: alias.staff.rmpunish,
		category: 'staff',
		cooldown: 30,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['831996400782016563'],
		delete: true,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		const data = await punish.findOne({ punishID: args[0] });
		if(!data) return message.channel.send(fail('I couldn\'t find a punishment with this ID!', 'dummy'));
		if(data.staffID !== message.author.id && !message.member.hasPermission('MANAGE_ROLES')) {
			return message.channel.send(fail('Only head mods and above are allowed to delete other mods\' punishments.', 'Come back when you\'re more respected'));
		}
		const embed = succ(`Deleted the punishment with ID \`${data.punishID}\``, 'yay')
			.addField('Case Data', `**Type:** ${data.caseType}\n**User:** <@${data.userID}>\n**Moderator:** <@${data.staffID}>\n**Reason:** ${data.reason}`);
		return message.channel.send(embed);
	},
};
