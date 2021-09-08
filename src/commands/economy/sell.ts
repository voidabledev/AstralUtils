/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { MessageEmbed } from 'discord.js';
import { success, fail } from '../../structures/embeds';

export const command: Command = {
	name: 'sell',
	description: 'Sells an item for 75% of its original price.',
	category: 'Economy',
	options: [
		{
			type: Options.String,
			name: 'item-id',
			description: 'The ID of the item you want to sell.',
			required: true,
		},
		{
			type: Options.Integer,
			name: 'amount',
			description: 'How many instances of this item you want to sell (default: 1)',
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
		if (!item.sellable) {
			return interaction.reply({
				embeds: [fail('You can\'t sell that item!')],
			});
		}
		if ((profile.itemIds[item.id] ?? 0) < amount) {
			return interaction.reply({
				embeds: [fail(`You don't have enough ${item.name}${item.name.endsWith('s') || item.name.endsWith('x') || item.name.endsWith('sh') ? 'es' : 's' } to sell that many!`)],
			});
		}
		const sellAmount = Math.round(item.price * amount * 0.75);
		await client.economy.addCoins(interaction.user.id, sellAmount);
		await client.economy.removeItem(interaction.user.id, item.id, amount);
		await interaction.reply({
			embeds: [success(`You have sold ${amount} ${item.name}${amount > 1 ? item.name.endsWith('s') || item.name.endsWith('x') || item.name.endsWith('sh') ? 'es' : 's' : ''} for <:AstralCoin:877583618770370582>${sellAmount}.`)],
		});
	},
};
