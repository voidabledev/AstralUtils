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
		const usr = message.mentions.users.first() || message.author;

		const membero = guild.members.cache.get(usr.id);

		const usero = membero.user;
		const embed = new MessageEmbed()
			.setAuthor(`${usr.tag}`, `${usr.displayAvatarURL({ dynamic: true })}`)
			.setThumbnail(`${usr.displayAvatarURL({ dynamic: true })}`)
			.setDescription(`${usr}'s Information`)
			.addField('**ID:**', `${usr.id}`)
			.addField('**Avatar URL:**', `${usr.displayAvatarURL({ dynamic: true })}`)
			.addField('**Nickname (If Applicable):**', `${membero.nickname || '**Cannot Find A Nickname For This User**'}`)
			.addField('**Joined Server:**', `${membero.joinedAt}`)
			.addField('**Joined Discord:**', `${usr.createdAt}`);
		message.channel.send(embed);
	},
};