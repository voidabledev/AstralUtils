import { Command } from '../Typings/Command';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
	name: 'serverinfo',
	description: 'View information about this server.',
	async run(interaction, options, client) {
		if (!interaction.guild) return;

		await interaction.guild.members.fetch();

		const { cache: members } = interaction.guild.members;
		const { cache: channels } = interaction.guild.channels;
		const { cache: roles } = interaction.guild.roles;
		const verificationLevel = interaction.guild.verificationLevel
			.replace('_', ' ')
			.toLowerCase();

		const embed = new MessageEmbed()
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }) ?? '')
			.setAuthor(
				interaction.guild.name,
				interaction.guild.iconURL({ dynamic: true }) ?? undefined,
			)
			.setColor('RANDOM')
			.addFields(
				{ name: 'Name', value: interaction.guild.name, inline: true },
				{ name: 'ID', value: `${interaction.guild.id}`, inline: true },
				{ name: '\u200b', value: '\u200b', inline: true },
				{
					name: 'Verification Level',
					value:
						verificationLevel.slice(0, 1).toUpperCase() +
						verificationLevel.slice(1),
					inline: true,
				},
				{
					name: 'Owner',
					value: `<@${interaction.guild.ownerId}>`,
					inline: true,
				},
				{
					name: 'Creation Date',
					value: `<t:${Math.floor(
						interaction.guild.createdTimestamp / 1000,
					)}:R>`,
					inline: true,
				},
				{ name: 'Roles', value: `${roles.size}`, inline: true },
				{
					name: 'Total | Humans | Bots',
					value: `${interaction.guild.memberCount} | ${
						members.filter((member) => !member.user.bot).size
					} | ${members.filter((member) => member.user.bot).size}`,
					inline: true,
				},
				{ name: 'Channels', value: `${channels.size}`, inline: true },
			)
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	},
};
