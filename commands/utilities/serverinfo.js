/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const Discord = require('discord.js');
const moment = require('moment');
const verificationLevels = {
	NONE: 'None',
	LOW: 'Low',
	MEDIUM: 'Medium',
	HIGH: 'High',
	VERY_HIGH: 'Very High',
};
const regions = {
	brazil: 'Brazil',
	europe: 'Europe',
	hongkong: 'Hong Kong',
	india: 'India',
	japan: 'Japan',
	russia: 'Russia',
	singapore: 'Singapore',
	southafrica: 'South Africa',
	sydney: 'Sydeny',
	'us-central': 'US Central',
	'us-east': 'US East',
	'us-west': 'US West',
	'us-south': 'US South',
};

module.exports = {
	help: {
		name: 'serverinfo',
		description: 'Displays the server information',
		usage: 'utilities',
		aliases: alias.utilities.serverinfo,
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
		const roles = message.guild.roles.cache;
		const members = message.guild.members.cache;
		const channels = message.guild.channels.cache;
		const embed = new Discord.MessageEmbed()
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
			.setColor('RANDOM')
			.addFields(
				{ name: 'Name', value: message.guild.name, inline: true },
				{ name: 'ID', value: message.guild.id, inline: true },
				{ name: 'Region', value: regions[message.guild.region], inline: true },
				{ name: 'Total | Humans | Bots', value: `${message.guild.memberCount} | ${members.filter(member => !member.user.bot).size} | ${members.filter(member => member.user.bot).size}`, inline: true },
				{ name: 'Verification Level', value: verificationLevels[message.guild.verificationLevel], inline: true },
				{ name: 'Channels', value: channels.size, inline: true },
				{ name: 'Roles', value: roles.size, inline: true },
				{ name: 'Creation Date', value: `${moment(message.guild.createdTimestamp).format('LL')} (${moment(message.guild.createdTimestamp).format('LT')}) - ${moment(message.guild.createdTimestamp).fromNow()}`, inline: true },
				{ name: '\u200b', value: '\u200b' },
			)
			.setFooter(`Requested By: ${message.author.username}`)
			.setTimestamp();
		message.channel.send(embed);
	},
};