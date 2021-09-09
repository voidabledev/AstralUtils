/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { MessageEmbed } from 'discord.js';
import { fail } from '../../structures/embeds';

export const command: Command = {
	name: 'warns',
	description: 'Checks your active warnings.',
	async run(interaction, options, client) {
		const user = interaction.guild.members.fetch(interaction.user.id);
		const punishes = client.modlogs.fetch({ userID: interaction.user.id, isActive: true });
		if (!(await punishes).length) {
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
			.setDescription(`\`${(await punishes).length}\` punishments found for ${interaction.member}.`)
			.setFooter(`User ID: ${interaction.user.id}`)
			.setColor('RANDOM');
		(await punishes).forEach((punishment) => {
			embed.addField(`Punishment ID: ${punishment.punishID}`,
				`- **Reason:** ${punishment
					.reason}\n- **Staff:** <@${punishment
					.staffID}>\n- **Expires:** <t:${Math.floor(punishment
					.timestamp / 1000)}:R>`);
		});
		interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	},
};