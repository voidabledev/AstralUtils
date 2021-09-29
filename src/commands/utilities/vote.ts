/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export const command: Command = {
	name: 'vote',
	description: 'Get a link to this server\'s voting page.',
	async run(interaction, options, client) {
		const embed = new MessageEmbed()
			.setDescription(`> Vote for **${interaction.guild?.name}**`)
			.setColor('GREEN');
		const row = new MessageActionRow({
			components: [
				new MessageButton({
					style: 'LINK',
					url: 'https://top.gg/servers/831995980097388604/vote',
					label: 'Vote here',
				}),
			],
		});
		await interaction.reply({
			embeds: [embed],
			components: [row],
			ephemeral: true,
		});
	},
};
