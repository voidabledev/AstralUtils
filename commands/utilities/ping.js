/* eslint-disable no-unused-vars */
const Discord = require('discord.js');
const alias = require('../../json/aliases.json');

module.exports = {
	name: 'ping',
	description: 'Get the latency of the bot',
	aliases: alias.utilities.ping,
	cooldown: 10,
	help: {
		name: 'ping',
		description: 'Get the bot\'s latency',
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
			.setDescription(`**Latency:** \`\`${Date.now() - message.createdTimestamp}\`\` ms\n**API Latency:** \`\`${Math.round(client.ws.ping)}\`\` ms`);
		msg.edit(em);
	},
};
