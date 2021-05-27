const Discord = require('discord.js');
const alias = require('../../json/aliases.json');
const ms = require('ms');
module.exports = {
	name: 'ping',
	description: 'Get the latency of the bot',
	aliases: alias.devs.ping,
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

		const timeNow = Date.now();
		const m = await message.channel.send('Pinging...');
		const messageLat = Date.now() - timeNow;
		const ping = ms(client.uptime);

		const e = new Discord.MessageEmbed()
			.addField('Client Ping', `${Math.round(client.ws.ping)}ms`, true)
			.addField('Message Latency', `${messageLat}ms`, true)
			.addField('Uptime', ping)
			.setColor('RANDOM')
			.setTimestamp();
		m.edit(e);
	},
};
