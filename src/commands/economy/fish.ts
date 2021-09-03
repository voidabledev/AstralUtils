/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { Client } from '../../structures/client';
import { MessageEmbed } from 'discord.js';
import { success, fail } from '../../structures/embeds';
import { textChangeRangeIsUnchanged } from 'typescript';

const outcomes: { display: string; chance: number; run: (client: Client, userId: string) => Promise<unknown> }[] = [
	{
		display: 'Nothing',
		chance: 0.4,
		run: () => null,
	},
	{
		display: '3 common fish',
		chance: 0.2,
		run: (client, userId) => client.economy.addItem(userId, 'commonfish', 3),
	},
	{
		display: '1 rare fish',
		chance: 0.1,
		run: (client, userId) => client.economy.addItem(userId, 'rarefish', 1),
	},
	{
		display: 'a fishing rod, what the hell!?',
		chance: 0.1,
		run: (client, userId) => client.economy.addItem(userId, 'fishrod', 1),
	},
	{
		display: 'some garbage',
		chance: 0.2,
		run: (client, userId) => client.economy.addItem(userId, 'garbage', 1),
	},
];
export const command: Command = {
	name: 'fish',
	description: 'Use your fishing rod.',
	async run(interaction, options, client) {
		const profile = client.economy.getProfile(interaction.user.id);
		if (!client.economy.hasAbility(Object.keys(profile.itemIds), 'fish')) {
			return interaction.reply({
				embeds: [fail('You can\'t fish without a fishing rod!')],
			});
		}
	},
};
// hover - fix <x>
// how do i get the eslint auto correct thing again? sorry for asking so much
// I get "no quick fixes availbile"