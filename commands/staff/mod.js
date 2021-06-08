/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const id = require('../../functions/id.js');
const log = require('../../functions/process-log.js');

module.exports = {
	help: {
		name: 'mod',
		description: 'Moderates a nickname',
		usage: '[mention or id]',
		aliases: alias.staff.mod,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: ['MANAGE_NICKNAMES'],
		botPerms: ['MANAGE_NICKNAMES'],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		let target = message.mentions.members.first();
		if (!target) {
			target = await message.guild.members.fetch(args[0]);
		}
		if (!target) {
			return message.channel.send(
				failureEmbed(
					'You didn\'t provide a user.',
				),
			);
		}
		if (!target.manageable) {
			return message.channel.send(
				failureEmbed('I can\'t edit that user\'s nickname.'),
			);
		}
		if (target.nickname.has('Moderated Nickname')) {
			return message.channel.send(failureEmbed('That user is already moderated!'));
		}
		const mod = id(36, 8);
		target.setNickname(`Moderated Nickname ${mod}`);
		message.channel.send(`Moderated the name to \`Moderated Nickname ${mod}\`.`);
		log({
			guildID: message.guild.id,
			userID: target.user.id,
			staffID: message.author.id,
			reason: 'Rule 10',
			caseType: 'Moderated Nickname',
			timestamp: new Date().getTime(),
		}, client);
	},
};