/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { Client } from '../../structures/client';
import { MessageEmbed } from 'discord.js';
import { success, fail } from '../../structures/embeds';

const outcomes: { display: string; chance: number; run: (client: Client, userId: string) => Promise<unknown> }[] = [
	{
		display: 'nothing',
		chance: 0.99,
		run: () => null,
	},
	{
		display: 'a dragon',
		chance: 0.01,
		run: (client, userId) => client.economy.addItem(userId, 'dragon', 1),
	},
];
export const command: Command = {
	name: 'hunt',
	description: 'Hunt animals in the forest.',
	cooldown: 30000,
	async run(interaction, options, client) {
		const profile = client.economy.getProfile(interaction.user.id);
		if (!client.economy.hasAbility(Object.keys(profile.itemIds), 'hunt')) {
			return interaction.reply({
				embeds: [fail('You can\'t hunt without a rifle!')],
			});
		}
		const roll = Math.random();
		let count = 0;
		let outcome: typeof outcomes[0];
		for (const that of outcomes) {
			count += that.chance;
			if (roll < count) {
				outcome = that;
				break;
			}
		}
		await outcome.run(client, interaction.user.id);
		await interaction.reply({
			embeds: [success(`You went hunting in the forest and brought back ${outcome.display}!`)],
		});
	},
};