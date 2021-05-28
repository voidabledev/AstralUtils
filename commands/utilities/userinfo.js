/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

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
		const guild = message.guild;
		const user = message.mentions.users.first() || message.author;
		const member = guild.members.cache.get(user.id);
		const embed = new MessageEmbed()
			.setAuthor(`${user.tag}`, `${user.displayAvatarURL({ dynamic: true })}`)
			.setThumbnail(`${user.displayAvatarURL({ dynamic: true })}`)
			.setDescription(`${user}'s Information`)
			.addField('**ID:**', `${user.id}`)
			.addField('**Avatar URL:**', `${user.displayAvatarURL({ dynamic: true })}`)
			.addField('**Nickname (If Applicable):**', `${member.nickname || '**Cannot Find A Nickname For This User**'}`)
			.addField('**Joined Server:**', `${member.joinedAt}`)
			.addField('**Joined Discord:**', `${user.createdAt}`);
		message.channel.send(embed);
	},
};