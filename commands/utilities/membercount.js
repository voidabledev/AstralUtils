/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'membercount',
		description: 'Displays the membercount',
		usage: '',
		aliases: alias.utilities.membercount,
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
		const members = message.guild.members.cache;
		const membercount = message.guild.memberCount;
		message.channel.send(new MessageEmbed()
			.setDescription(`**Total Members:** \`${membercount}\`\n**Humans:** \`${members.filter(member => !member.user.bot).size}\`\n**Bots:** \`${members.filter(member => member.user.bot).size}\``)
			.setFooter(`Requested By: ${message.author.tag}`)
			.setTimestamp(),
		);
	},
};