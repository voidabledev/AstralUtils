/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message, MessageEmbed } from 'discord.js';
import { Event } from '../typings/event';
import { devs, token, testing } from '../config.json';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
export const event: Event = {
	event: 'messageCreate',
	async run(client, message: Message) {
		if (message.author.bot) return;
		await client.automod.run(message);
		const isProd = process.argv0.includes('heroku');
		if (message.content === (isProd ? '=' : '+') + 'deploy' && devs.includes(message.author.id)) {
			if (!client.user || !message.guild) return;
			const commands = client.commands.map(({ run, allowed, cooldown, ...data }) => data);
			const rest = new REST({ version: '9' }).setToken(isProd ? token : testing);
			const start = Date.now();
			const msg = await message.channel.send('Refreshing slash commands...');
			try {
				await rest.put(
					Routes.applicationGuildCommands(client.user.id, message.guild.id),
					{ body: commands },
				);
				await msg.edit(
					`Refreshed ${commands.length} commands in ${Date.now() - start}ms.`,
				);
			}
			catch (e) {
				await msg.edit(`Failed to refresh commands:\n${e}`);
			}
		}
		if (message.content === (isProd ? '=' : '+') + 'deploy rm' && devs.includes(message.author.id)) {
			if (!client.user || !message.guild) return;
			const rest = new REST({ version: '9' }).setToken(isProd ? token : testing);
			try {
				await rest.put(
					Routes.applicationGuildCommands(client.user?.id, message.guild.id),
					{ body: [] },
				);
				await message.channel.send('Removed slash commands from this server.');
			}
			catch (e) {
				await message.channel.send(`Failed to remove slash commands: \`${e}\``);
			}
		}
		if (message.member && client.afk.get(message.author.id)) {
			await client.afk.unset(message.member);
			const embed = new MessageEmbed()
				.setDescription(`Welcome back ${message.member}, I removed your AFK.`)
				.setColor('GREEN');
			message
				.reply({
					embeds: [embed],
					allowedMentions: { repliedUser: false },
				})
				.then((m) => setTimeout(() => m.delete(), 5000));
		}
		const afk = client.afk.get(message.mentions.members?.first()?.id ?? '');
		if (afk) {
			const embed = new MessageEmbed()
				.setDescription(`<@${afk.userId}> is AFK: \`${afk.message}\``)
				.setColor('RED');
			message
				.reply({
					embeds: [embed],
					allowedMentions: { repliedUser: false },
				})
				.then((m) => setTimeout(() => m.delete(), 5000));
		}
	},
};
