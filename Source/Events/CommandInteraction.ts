import { Interaction } from 'discord.js';
import { Event } from '../Typings/Event';
import { fail } from '../Modules/Embeds';

export const event: Event = {
	event: 'interactionCreate',
	async run(client, interaction: Interaction) {
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);
		if (!command) return;

		const allowed = (await command.allowed?.(interaction, client)) ?? true;
		if (!allowed) {
			return interaction.reply({
				embeds: [fail('You don\'t have permission to use this command!')],
				ephemeral: true,
			});
		}

		try {
			await command.run(interaction, interaction.options, client);
		}
		catch (err) {
			await interaction[
				interaction.replied || interaction.deferred ? 'followUp' : 'reply'
			]({
				ephemeral: true,
				content: `Failed with error:\n${err}`,
			});
		}
	},
};
