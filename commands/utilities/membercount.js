/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'membercount',
		description: 'Displays the membercount',
		usage: 'None',
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
		const membercount = message.guild.memberCount;
		message.channel.send(new MessageEmbed()
			.setTitle('Members')
			.setDescription(`Member Count: ${membercount}`),
		);
	},
};