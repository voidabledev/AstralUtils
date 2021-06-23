/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const alias = require('../../json/aliases.json');

module.exports = {
	help: {
		name: 'ping',
		description: 'Get the bot\'s ping.',
		usage: '',
		aliases: alias.utilities.ping,
		category: 'utilities',
		cooldown: 10,
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
		const msg = await message.channel.send('Pinging...');
		const em = new Discord.MessageEmbed()
			.setDescription(`**Latency:** \`${Date.now() - message.createdTimestamp}\` ms\n**API Latency:** \`${Math.round(client.ws.ping)}\` ms`)
			.setColor('RANDOM');
		msg.edit(em);
	},
};
