/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
	name: 'inventory',
	description: 'Shows your inventory, or the inventory of another user.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user to show the inventory of.',
		},
	],
	async run(interaction, options, client) {
		const user = options.getUser('user') ?? interaction.user;
		const { itemIds: items } = client.economy.getProfile(user.id);
		const embed = new MessageEmbed()
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setTitle(`${user.username}'s inventory`)
			.setDescription(Object.keys(items).filter((i) => items[i] !== 0).map((item) => `${items[item]} x ${client.economy.getItem(item).name}`).join('\n'))
			.setColor('RANDOM')
			.setFooter('what a noob')
			.setTimestamp();
		await interaction.reply({
			embeds: [embed],
		});
	},
};
