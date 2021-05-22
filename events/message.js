/* eslint-disable no-unused-vars */
const errEmbed = require('../utils/error-embed.js');
const failureEmbed = require('../utils/failure-embed.js.js');
const Discord = require('discord.js');
const conf = require('../json/configuration.json');
module.exports = {
	name: 'message',
	once: false,
	async execute(message, client) {
		const { cooldowns } = client;
		const prefix = process.argv[2].length ? conf.betaPrefix : conf.prefix;
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command =
      client.commands.find((cmd) => cmd.name.toLowerCase() === commandName) ||
      client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName),
      );
		if (!command) return;
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}
		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 1) * 1000;
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.channel.send(
					failureEmbed(
						`Please wait ${timeLeft.toFixed(
							1,
						)} more second(s) before reusing the \`${command.name}\` command.`,
					),
				);
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		try {
			command.execute(message, args, client);
		}
		catch (errorMessage) {
			errEmbed(errorMessage);
		}
	},
};
