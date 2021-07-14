/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const punish = require('../../models/punishschema');
const ms = require('../../functions/ms');

module.exports = {
	help: {
		name: 'duration',
		description: 'Change the duration for an existing punishment.',
		usage: '[punishment ID] [new duration]',
		aliases: alias.staff.duration,
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
		if (!oldCase.isActive) return message.channel.send(failureEmbed('This punishment isn\'t timed, or it has already expired!'));
		const duration = ms(args[1]);
		if (duration < 0) return message.channel.send('Please enter a valid time.');
		const expires = Date.now() + duration;
		await punish.updateOne({
			punishID: args[0],
		}, {
			expires,
		});
		message.channel.send(
			successEmbed(
				`This punshment now expires <t:${Math.floor(expires / 1000)}:R>.`,
			));
	},
};