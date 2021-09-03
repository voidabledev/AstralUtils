/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { MessageEmbed } from 'discord.js';
import { success, fail } from '../../modules/embeds';

export const command: Command = {
	name: 'use',
	description: 'Uses an item you have in your inventory.',
	options: [
		{
			type: Options.String,
			name: 'item-id',
			description: 'The ID of the item you want to use.',
			required: true,
		},
		{
			type: Options.Integer,
			name: 'amount',
			description: 'How many instances of this item you want to use (default: 1)',
		},
	],
	async run(interaction, options, client) {
		const itemId = options.getString('item-id', true).toLowerCase();
		const amount = Math.max(1, options.getInteger('amount') ?? 1);
		const item = client.economy.getItem(itemId);
		const profile = client.economy.getProfile(interaction.user.id);
		if (!item) {
			return interaction.reply({
				embeds: [fail('I couldn\'t find the item you requested! Make sure to use the item\'s ID, not its name.')],
			});
		}
		if (!item.usable) {
			return interaction.reply({
				embeds: [fail('You can\'t use that item!')],
			});
		}
		if ((profile.itemIds[itemId] ?? 0) < amount) {
			return interaction.reply({
				embeds: [fail(`You don't have enough ${item.name}${item.name.endsWith('s') || item.name.endsWith('x') ? 'es' : 's' } to use that many!`)],
			});
		}
		try {
			const feedback = await item.use(interaction.user.id, amount);
			await client.economy.removeItem(interaction.user.id, itemId, amount);
			await interaction.reply({
				embeds: [success(feedback)],
			});
		}
		catch (e) {
			await interaction.reply({
				embeds: [fail(e)],
			});
		}
	},
};
