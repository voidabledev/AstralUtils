import { Interaction } from 'discord.js';
import { Event } from '../typings/event';
import { success, fail } from '../structures/embeds';

export const event: Event = {
	event: 'interactionCreate',
	async run(client, interaction: Interaction) {
		if (!interaction.isButton()) return;
		if (interaction.customId.startsWith('control-giveaway-')) {
			try {
				await client.giveaways.displayControl(interaction);
			}
			catch (e) {
				await interaction[interaction.deferred || interaction.replied ? 'followUp' : 'reply']({
					embeds: [fail(`Failed with error:\n${e.message}`)],
					ephemeral: true,
				});
			}
		}
		if (interaction.customId.startsWith('enter-giveaway-')) {
			const [blacklist] = await client.modlogs.fetch({ userID: interaction.user.id, caseType: 'Blacklist', isActive: true });
			if (blacklist) {
				return interaction.reply({
					embeds: [fail('You\'re blacklisted.')],
					ephemeral: true,
				});
			}
			const msg = await client.giveaways.enter(
				interaction.customId.replace('enter-giveaway-', ''),
				interaction.user.id,
			);
			if (msg === 'Entered!') {
				return await interaction.reply({
					embeds: [success(msg)],
					ephemeral: true,
				});
			}
			return await interaction.reply({ embeds: [fail(msg)], ephemeral: true });
		}
		if (interaction.customId.startsWith('reroll-giveaway-')) {
			client.giveaways
				.reroll(
					interaction.customId.replace('reroll-giveaway-', ''),
					interaction,
				)
				.then(() =>
					interaction.editReply({
						embeds: [success('Giveaway rerolled!')],
						components: [],
					}),
				)
				.catch(() =>
					interaction.editReply({
						embeds: [fail('Cancelled.')],
						components: [],
					}),
				);
		}
		if (interaction.customId.startsWith('end-giveaway-')) {
			client.giveaways.end(interaction.customId.replace('end-giveaway-', ''));
			return await interaction.reply({
				embeds: [success('Giveaway ended!')],
				ephemeral: true,
			});
		}
		if (interaction.customId.startsWith('delete-giveaway-')) {
			client.giveaways.delete(
				interaction.customId.replace('delete-giveaway-', ''),
			);
			return interaction.reply({
				embeds: [success('Giveaway deleted!')],
				ephemeral: true,
			});
		}
	},
};
