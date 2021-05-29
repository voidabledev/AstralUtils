/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');

module.exports = {
	help: {
		name: 'role',
		description: 'Add or remove a role from a user',
		usage: '[user mention or ID] [+/-] [role name or ID]',
		aliases: alias.staff.role,
		category: 'staff',
		cooldown: 10,
	},
	data: {
		minArgs: 3,
		maxArgs: null,
		userPerms: ['MANAGE_ROLES'],
		botPerms: ['MANAGE_ROLES'],
		requiredRoles: [],
		delete: true,
	},
	async execute(message, args, client) {
		const targetUser =
		message.mentions.users.first() || (await client.users.fetch(args[0]));
		if (!targetUser) {
			return message.channel.send(
				failureEmbed(
					'Please specify who to give the role to.',
					'bruh moment',
				),
			);
		}
		args.shift();
		const mode = args.shift();
		const roleName = args.join(' ');
		const { guild } = message;
		const role =
		guild.roles.cache.find(
			(r) =>
				r.name.toLowerCase() === roleName.toLowerCase() ||
				(r.name.startsWith('• ') && r.name.slice(2) === roleName),
		) || guild.roles.cache.get(roleName);
		if (!role) {
			return message.channel.send(
				failureEmbed('There is no role with that name.', 'duh'),
			);
		}
		if (role.position >= message.member.roles.highest.position) {
			return message.channel.send(
				failureEmbed(
					'You can\'t give out roles higher than or equal to your highest rank!',
					'duh',
				),
			);
		}
		if (role.position >= message.guild.me.roles.highest.position) {
			return message.channel.send(
				failureEmbed('I can\'t manage this role!', 'eh'),
			);
		}
		const member = guild.members.cache.get(targetUser.id);
		if (['+', 'add', 'give'].includes(mode)) {
			if (member.roles.cache.get(role.id)) {
				return message.channel.send(
					failureEmbed(
						`${member} already has the ${role.name} role!`,
						'duh',
					),
				);
			}
			return message.channel.send(
				successEmbed(`${member} now has the ${role.name} role`, 'yay'),
			);
		}
		if (['-', 'remove', 'rm', 'take'].includes(mode)) {
			if (!member.roles.cache.get(role.id)) {
				return message.channel.send(
					failureEmbed(
						`${member} doesn't have the ${role.name} role!`,
						'duh',
					),
				);
			}
			member.roles.remove(role);
			return message.channel.send(
				successEmbed(
					`${member} now no longer has the ${role.name} role`,
					'sad',
				),
			);
		}
		return message.channel.send(
			failureEmbed(
				`Please tell me if I should give or take the role!\nValid keywords are: \`${[
					'+',
					'add',
					'give',
				].join(', ')}\` for adding a role and \`${[
					'-',
					'remove',
					'rm',
					'take',
				].join(', ')}\``,
				'lol what a noob',
			),
		);
	},
};