/* eslint-disable no-unused-vars */
const errEmbed = require('../functions/error-embed.js');
const failureEmbed = require('../functions/failure-embed.js');
const Discord = require('discord.js');
const conf = require('../json/configuration.json');
const perms = require('../functions/permissions.js');
const moment = require('moment');
const afkSchema = require('../models/afkschema');
const bl = require('../models/blacklistschema');

module.exports = {
	name: 'message',
	once: false,
	async execute(message, client) {
		const { cooldowns } = client;
		const prefix = process.argv.length > 2 ? conf.betaPrefix : conf.prefix;
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		if (await bl.findOne({ userID: message.author.id })) return;
		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command =
      client.commands.get(commandName) ||
      client.commands.find((cmd) => cmd.help.aliases && cmd.help.aliases.includes(commandName),
      );
		if (!command) return;
		if (command.data.delete) message.delete();
		perms(command.data.userPerms);
		perms(command.data.botPerms);
		if (command.data.userPerms.length && !command.data.userPerms.some((p) => message.member.hasPermission(p))) {
			return message.channel.send(failureEmbed(
				'You don\'t have permission to use this command!',
				'Come back when you are more respected',
			));
		}
		if (command.data.botPerms.length && command.data.botPerms.some(p => !message.guild.me.hasPermission(p))) {
			return message.channel.send(failureEmbed(
				'I don\'t have enough permission to use this command!',
				'Contact an admin to fix this.',
			));
		}
		if (args.length < command.data.minArgs || (command.data.maxArgs !== null) && args.length > command.data.maxArgs) {
			return message.channel.send(failureEmbed(
				`Wrong usage! The correct usage for this command is: \`${prefix}${command.help.name} ${command.help.usage}\``,
				'what a noob',
			));
		}
		if(command.data.requiredRoles.length && !command.data.requiredRoles.some(r => message.member.roles.cache.get(r))) {
			return message.channel.send(failureEmbed(
				'You don\'t have permission to use this command!',
				'Come back when you are more respected',
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
			await command.execute(message, args, client);
		}
		catch (err) {
			message.channel.send(errEmbed(err));
		}
		const guildId = message.guild.id;
		if (message.mentions.members.first()) {
			const results = await afkSchema.find({
				guildId,
			});

			if (results) {
				for (const res of results) {
					const { userId, afk, timestamp } = res;
					if (message.mentions.members.first().id === message.author.id) return;

					if (message.mentions.members.first().id === userId) {
						const member = message.guild.members.cache.get(userId);

						return message.channel.send(new Discord.MessageEmbed()
							.setColor(message.guild.me.displayColor)
							.setAuthor(`${member.user.username} is AFK`, member.user.displayAvatarURL())
							.setDescription(`\`${afk}\``)
							.setFooter(`${moment(timestamp).fromNow()}`));
					}
				}
			}
		}

		const afkResults = await afkSchema.find({
			guildId,
		});
		if (afkResults) {
			for (const res of afkResults) {
				const { userId, timestamp, username } = res;
				if (timestamp + (1000 * 10) <= new Date().getTime()) {
					if (message.author.id === userId) {
						await afkSchema.findOneAndDelete({
							guildId,
							userId,
						});
						message.member.setNickname(`${username}`).catch((e) => {
							console.log('No Permissions');
						});
						return message.channel.send(new Discord.MessageEmbed()
							.setColor(message.guild.me.displayColor)
							.setDescription(`Welcome back <@${message.member.id}>, I removed your afk`));
					}
				}
			}
		}
	},
};
