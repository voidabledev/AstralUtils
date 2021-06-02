/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
	help: {
		name: 'userinfo',
		description: 'Displays information of a user',
		usage: '[user]',
		aliases: alias.utilities.userinfo,
		category: 'utilities',
		cooldown: 5,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		let member =
    message.mentions.members.last() ||
    message.guild.members.cache.get(args[0]);
		if (!member) member = message.author;

		const trimArray = (arr, maxLen = 10) => {
			if (arr.length > maxLen) {
				const len = arr.length - maxLen;
				arr = arr.slice(0, maxLen);
				arr.push(` and ${len} more roles...`);
			}
			return arr;
		};
		const upperCase = (str) => {
			return str.toUpperCase().replace(/_/g, ' ').split(' ').join(' ');
		};
		const roles = member.roles.cache
			.sort((a, b) => b.position - a.position)
			.map((role) => role.toString())
			.slice(0, -1);
		const embed = new MessageEmbed()
			.setAuthor(
				`${member.user.tag}`,
				member.user.displayAvatarURL({ dynamic: true, size: 512 }),
			)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
			.addFields(
				{
					name: 'Joined Discord',
					value: `${moment(member.user.createdTimestamp).format('DD MMM YYYY')}`,
					inline: true,
				},
				{
					name: 'Joined Server',
					value: `${moment(member.joinedAt).format('DD MMM YYYY')}`,
					inline: true,
				},
				{
					name: 'Nickname',
					value: `${member.displayName}` || 'None',
					inline: true,
				},
				{
					name: 'Discriminator',
					value: `${member.user.discriminator}`,
					inline: true,
				},
				{
					name: 'User Colour',
					value: `${upperCase(member.displayHexColor)}`,
					inline: true,
				},
				{ name: 'User ID', value: `${member.user.id}`, inline: true },
				{
					name: 'Highest Role',
					value: `${
						member.roles.highest.id === message.guild.id
							? 'None'
							: member.roles.highest
					}`,
					inline: true,
				},
				{
					name: 'Roles',
					value: `${
						roles.length < 10
							? roles.join(', ')
							: roles.length > 10
								? trimArray(roles).join(', ')
								: 'None'
					}`,
					inline: false,
				},
			)
			.setColor(`${member.displayHexColor || 'RANDOM'}`);
		message.channel.send(embed);
	},
};