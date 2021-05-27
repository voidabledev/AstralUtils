/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
async function id(base, length) {
	let identification = Math.floor(Math.random() * base ** length).toString(base);
	while (id.length < length) {
		identification = '0' + identification;
	}
	return identification;
}

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
		delete: true,
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
		const mod = id(32, 8);
		target.setNickname(`Moderated Nickname ${mod}`);
		message.channel.send(successEmbed(`Moderated ${target}'s nickname.`));
	},
};