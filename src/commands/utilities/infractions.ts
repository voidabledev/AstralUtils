/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed } from 'discord.js';
import { fail } from '../../structures/embeds';

export const command: Command = {
	name: 'infractions',
	description: 'Checks your active punishments.',
	async run(interaction, options, client) {
		const punishes = await client.modlogs.fetch({ userID: interaction.user.id, isActive: true });
		if (!punishes.length) {
			return interaction.reply({
				embeds: [fail('You don\'t have any punishments.')],
				ephemeral: true,
			});
		}
		const embed = new MessageEmbed()
			.setAuthor(
				`Infractions for ${interaction.user.tag} - ${punishes.length}`,
				interaction.user.displayAvatarURL({
					dynamic: true, size: 512,
				}),
			)
			.setFooter(`User ID: ${interaction.user.id}`)
			.setColor('RANDOM');
		punishes.forEach((punishment) => {
			embed.addField(`${punishment.caseType}`, `
      Reason: \`${punishment.reason}\`\nDate: <t:${Math.floor(punishment.timestamp / 1000)}:f>\nPunishment ID: \`${punishment.punishID}\`
      `);
		});
		interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};