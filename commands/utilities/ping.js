const Discord = require('discord.js');
const alias = require('../../json/aliases.json');
module.exports = {
	name: 'ping',
	description: 'Get the latency of the bot',
	aliases: alias.devs.ping,
	cooldown: 10,
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		// ...
		/* if(!message.member.roles.cache.has('')) return message.delete(); */
		message.channel.send('Pinging...').then((resMsg) => {
			const botPing = resMsg.createdTimestamp - message.createdTimestamp;
			const embed = new Discord.MessageEmbed()
				.setColor('BLURPLE')
				.setTitle('Pong!')
				.addFields(
					{
						name: 'Latency of the bot',
						value: `${botPing} miliseconds`,
						inline: true,
					},

					{
						name: 'Latency of the websocket',
						value: `${client.ws.ping} miliseconds`,
						inline: false,
					},
				)
				.setTimestamp();
			message.channel.send(embed);
		});
	},
};
