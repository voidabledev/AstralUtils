/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { MessageEmbed } from 'discord.js';
import { success, fail } from '../../structures/embeds';

export const command: Command = {
	name: 'gift',
	description: 'Gives an item you have in your inventory to someone else.',
	category: 'Economy',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user you want to give the item to',
			required: true,
		},
		{
			type: Options.String,
			name: 'item-id',
			description: 'The ID of the item you want to use.',
			required: true,
		},
		{
			type: Options.Integer,
			name: 'amount',
			description: 'How many instances of this item you want to gift (default: 1)',
		},
	],
	async run(interaction, options, client) {
		const user = options.getUser('user', true).id;
		const itemId = options.getString('item-id', true).toLowerCase();
		const amount = Math.max(1, options.getInteger('amount') ?? 1);
		const item = client.economy.getItem(itemId);
		const me = client.economy.getProfile(interaction.user.id);
		const you = client.economy.getProfile(user);
		if (!item) {
			return interaction.reply({
				embeds: [fail('I couldn\'t find the item you want to share! Make sure to use the item\'s ID, not its name.')],
			});
		}
		if (me.userId === you.userId) {
			return interaction.reply({
				embeds: [fail('You can\'t give items to yourself!')],
			});
		}
		if ((me.itemIds[item.id] ?? 0) < amount) {
			return interaction.reply({
				embeds: [fail(`You don't have enough ${item.name}${item.name.endsWith('s') || item.name.endsWith('x') || item.name.endsWith('sh') ? 'es' : 's' } to gift that many!`)],
			});
		}
		await client.economy.removeItem(me.userId, item.id, amount);
		await client.economy.addItem(you.userId, item.id, amount);
		await interaction.reply({
			embeds: [success(`You gifted ${amount} ${item.name}${amount > 1 ? item.name.endsWith('s') || item.name.endsWith('x') || item.name.endsWith('sh') ? 'es' : 's' : ''} to <@${user}>`)],
		});
	},
};
