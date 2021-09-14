/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed } from 'discord.js';
import { fail } from '../../structures/embeds';

export const command: Command = {
	name: 'warns',
	description: 'Checks your active warnings.',
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
				interaction.user.displayAvatarURL({
					dynamic: true, size: 512,
				}),
				interaction.user.tag,
				'Punishments')
			.setDescription(`Found \`${punishes.length}\` punishments.`)
			.setFooter(`User ID: ${interaction.user.id}`)
			.setColor('RANDOM');
		punishes.forEach((punishment) => {
			embed.addField(`<t:${Math.floor(punishment.timestamp / 1000)}:R>`,
				`- **Reason:** ${punishment
					.reason}\n- **Expires:** <t:${Math.floor(punishment
					.expires / 1000)}:R>}`);
		});
		interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};