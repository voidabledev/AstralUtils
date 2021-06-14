/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const punish = require('../../models/punishschema');

module.exports = {
	help: {
		name: 'reason',
		description: 'Change the reason for an existing punishment',
		usage: '[punishment ID] [new reason]',
		aliases: alias.staff.reason,
		category: 'staff',
		cooldown: 10,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: ['MANAGE_MESSAGES'],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		const oldCase = await punish.findOne({
			punishID: args[0],
		});
		if (!oldCase) return message.channel.send(failureEmbed('I couldn\'t find a punishment associated with this ID!', 'Maybe it was removed?'));
		if (oldCase.staffID !== message.author.id && !message.member.hasPermission('MANAGE_ROLES')) {
			return message.channel.send(failureEmbed(
				'Only Head Moderators and up can change other staff\'s punishments.',
			));
		}
		const reason = args.slice(1).join(' ');
		await punish.updateOne({
			punishID: args[0],
		}, {
			reason,
		});
		message.channel.send(
			successEmbed(
				`I changed the reason of this case from \`${oldCase.reason}\` to \`${reason}\``,
			));
	},
};