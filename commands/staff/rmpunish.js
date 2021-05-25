// Packages you will need...
const alias = require('../../json/aliases.json');
const punish = require('../../models/punishschema');
const fail = require('../../functions/failure-embed');
const succ = require('../../functions/success-embed');
module.exports = {
	name: 'rmpunish',
	description: 'Removes a punishment',
	aliases: ['delpunish'] || alias.mod.rmpunish,
	cooldown: 30,
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		const data = await punish.findOneAndDelete({ punishID: args[0] });
		if(!data) return message.channel.send(fail('I couldn\'t find a punishment with this ID!', 'dummy'));
		const embed = succ(`Deleted the punishment with ID \`${data.punishID}\``, 'yay')
			.addField('Case Data', `**Type:** ${data.caseType}\n**User:** <@${data.userID}>\n**Moderator:** <@${data.staffID}>\n**Reason:** ${data.reason}`);
		return message.channel.send(embed);
	},
};
