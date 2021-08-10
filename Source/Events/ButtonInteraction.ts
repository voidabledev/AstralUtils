import { Interaction } from 'discord.js';
import { Event } from '../Typings/Event';
import { success, fail } from '../Modules/Embeds';

export const event: Event = {
	event: 'interactionCreate',
	async run(client, interaction: Interaction) {
		if (!interaction.isButton()) return;

		if (interaction.customId.startsWith('control-giveaway-')) {
			await client.giveaways.displayControl(interaction);
		}

		if (interaction.customId.startsWith('enter-giveaway-')) {
			const msg = await client.giveaways.enter(interaction.customId.replace('enter-giveaway-', ''), interaction.user.id);
			if (msg === 'Entered!') return await interaction.reply({ embeds: [success(msg)], ephemeral: true });
			return await interaction.reply({ embeds: [fail(msg)], ephemeral: true });
		}

		if (interaction.customId.startsWith('reroll-giveaway-')) {
			client.giveaways.end(interaction.customId.replace('reroll-giveaway-', ''));
			return await interaction.reply({ embeds: [success('Giveaway rerolled!')], ephemeral: true });
		}

		if (interaction.customId.startsWith('end-giveaway-')) {
			client.giveaways.end(interaction.customId.replace('end-giveaway-', ''));
			return await interaction.reply({ embeds: [success('Giveaway ended!')], ephemeral: true });
		}

		if (interaction.customId.startsWith('delete-giveaway-')) {
			client.giveaways.delete(interaction.customId.replace('delete-giveaway-', ''));
			return interaction.reply({ embeds: [success('Giveaway deleted!')], ephemeral: true });
		}
	},
};