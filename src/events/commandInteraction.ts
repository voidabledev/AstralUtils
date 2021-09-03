import { Interaction, Collection } from 'discord.js';
import { Event } from '../typings/event';
import { fail } from '../structures/embeds';

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
		if (command.cooldown) {
			const time = client.userCooldowns.get(command.name) ?? new Collection<string, Date>();
			const user = time.get(interaction.user.id) ?? new Date(0);
			if (user.getTime() + command.cooldown <= new Date().getTime()) {
				time.set(interaction.user.id, new Date());
				client.userCooldowns.set(command.name, time);
			}
			else {
				return interaction.reply({
					embeds: [fail(`You're on cooldown! You can use the ${command.name} command again <t:${Math.floor((user.getTime() + command.cooldown) / 1000)}:R>`)],
				});
			}
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
