/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { MessageEmbed } from 'discord.js';
import { success, fail } from '../../structures/embeds';

export const command: Command = {
	name: 'buy',
	description: 'Buys an item from the shop.',
	category: 'Economy',
	options: [
		{
			type: Options.String,
			name: 'item-id',
			description: 'The ID of the item you want to buy.',
			required: true,
		},
		{
			type: Options.Integer,
			name: 'amount',
			description: 'How many instances of this item you want to buy (default: 1)',
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
		if (profile.coins < item.price * amount) {
			return interaction.reply({
				embeds: [fail(`You need <:AstralCoin:877583618770370582>${item.price * amount} to buy ${amount} ${item.name}${amount > 1 ? 's' : ''}, but you only have <:AstralCoin:877583618770370582>${profile.coins}! Come back when you have enough coins to buy this.`)],
			});
		}
		await client.economy.removeCoins(interaction.user.id, item.price * amount);
		await client.economy.addItem(interaction.user.id, item.id, amount);
		await interaction.reply({
			embeds: [success(`You have bought ${amount} ${item.name}${amount > 1 ? item.name.endsWith('s') || item.name.endsWith('x') || item.name.endsWith('sh') ? 'es' : 's' : ''} for <:AstralCoin:877583618770370582>${amount * item.price}.`)],
		});
	},
};
