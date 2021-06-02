/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const log = require('../../functions/process-log');

module.exports = {
	help: {
		name: 'nick',
		description: 'Changes the nikcname of a member',
		usage: '[user] [nick]',
		aliases: alias.staff.nick,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: ['MANAGE_NICKNAMES'],
		botPerms: ['MANAGE_NICKNAMES'],
		requiredRoles: [],
		delete: true,
	},
	async execute(message, args, client) {
		const target =
    message.mentions.members.first() ||
    (await message.guild.members.fetch(args[0]));
		const nick = args.slice(1).join(' ');
		if (message.member.roles.highest.position <= target.roles.highest.position) {
			return message.channel.send(
				failureEmbed('You can\'t edit a user\'s nick higher than you!'),
			);
		}
		if (!target.manageable) {
			return message.channel.send(
				failureEmbed('I can\'t edit that user\'s nickname!'),
			);
		}
		if (target.id === message.author.id) {
			return message.channel.send(
				failureEmbed(
					'There\'s other ways to edit your nickname you know?'),
			);
		}
		if (nick.length > 32) {
			return message.channel.send(
				failureEmbed(
					'This nickname is too long, please try one with a most 32 characters!'),
			);
		}
		if (!nick) {
			target.setNickname('').then(() => {
				message.channel.send('I\'ve reset their nickname.');
			});
			return;
		}
		target.setNickname(nick);
		message.channel.send(`I've changed their nickname to \`${nick}\``);
		log({
			guildID: message.guild.id,
			userID: target.user.id,
			staffID: message.author.id,
			reason: 'No reason specified',
			caseType: 'Changed Nickname',
			timestamp: new Date().getTime(),
		}, client);
	},
};