/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'reportstaff',
		description: 'Report a staff member to the staff manager',
		usage: String,
		aliases: alias.staff.reportstaff,
		category: 'staff',
		cooldown: 60,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
		if (!target) {
			return message.channel.send(
				failureEmbed(
					'You didn\'t provide a valid user mention or id!',
					'get good noob',
				),
			);
		}
		if (target.user.id === client.user.id) {
			return message.channel.send(
				failureEmbed(
					'You can\'t report me!',
					'Trying to report a bug? DM a developer!',
				),
			);
		}
		if (target.user.id === message.author.id) {
			return message.channel.send(
				failureEmbed(
					'You can\'t report yourself!',
					'why are you reporting yourself dummy?',
				),
			);
		}
		if (target.roles.highest.position < message.guild.roles.cache.get('831996404549419018').position) {
			return message.channel.send(
				failureEmbed(
					'What are you doing? They aren\'t even a staff member...',
					'dummy, that\'s not how it works',
				),
			);
		}
		args.shift();
		const reason = args.join(' ');
		const staffManager = await client.users.fetch('691635044388700250');
		message.channel.send(
			successEmbed(
				'Your report was sent to the staff manager.',
				'report go brrrrr',
			),
		);
		const rEmbed = new MessageEmbed()
			.setTitle(`${message.author.tag} reported ${target.user.tag}`)
			.setDescription(`**Reason:** ${reason}`)
			.setFooter(`User ID: ${target.user.id}`);
		return staffManager.send(rEmbed);
	},
};