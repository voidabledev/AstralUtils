/* eslint-disable no-unused-vars */
const errEmbed = require('../functions/error-embed.js');
const failureEmbed = require('../functions/failure-embed.js');
const Discord = require('discord.js');
const conf = require('../json/configuration.json');
const perms = require('../functions/permissions.js');
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
      client.commands.get(commandName) ||
      client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName),
      );
		if (!command) return;

		perms(command.data.userPerms);
		perms(command.data.botPerms);
		if(!command.data.userPerms.some((p) => message.member.hasPermission(p))) {
			return message.channel.send(failureEmbed(
				'You don\'t have permission to use this command!',
				'Come back when you are more respected',
			));
		}
		if(command.data.botPerms.some(p => !message.guild.me.hasPermission(p))) {
			return message.channel.send(failureEmbed(
				'I don\'t have enough permission to use this command!',
				'Contact an admin to fix this.',
			));
		}
		if (!cooldowns.has(command.help.name)) {
			cooldowns.set(command.help.name, new Discord.Collection());
		}
		const now = Date.now();
		const timestamps = cooldowns.get(command.help.name);
		const cooldownAmount = (command.help.cooldown || 1) * 1000;
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
