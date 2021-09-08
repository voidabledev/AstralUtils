/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
	name: 'membercount',
	description: 'View the server\'s member count.',
	category: 'Utilities',
	async run(interaction, options, client) {
		if (!interaction.guild) return;
		await interaction.guild.members.fetch();
		const { cache: members } = interaction.guild.members;
		const embed = new MessageEmbed()
			.setAuthor(
				interaction.guild.name,
				interaction.guild.iconURL({ dynamic: true }) ?? undefined,
			)
			.setTitle('Member count')
			.setDescription(`${members.size}`)
			.setColor('RANDOM')
			.setTimestamp();
		await interaction.reply({ embeds: [embed] });
	},
};
