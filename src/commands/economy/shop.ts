/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { MessageEmbed } from 'discord.js';
import { success, fail, parsePages, pageMenu } from '../../structures/embeds';

export const command: Command = {
	name: 'shop',
	description: 'Show all items available in the shop, or details on a specific item.',
	options: [
		{
			type: Options.String,
			name: 'item-id',
			description: 'The user to show the balance of.',
		},
	],
	async run(interaction, options, client) {
		const itemId = options.getString('item-id');

		if (itemId) {
			const item = client.economy.getItem(itemId);
			const profile = client.economy.getProfile(interaction.user.id);
			if (!item) {
				return interaction.reply({
					embeds: [fail('I couldn\'t find the item you requested!')],
				});
			}
			const embed = new MessageEmbed()
				.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
				.setTitle(`${item.name} ${
					profile.itemIds[itemId] ? `(${profile.itemIds[itemId]} owned)` : ''
				}`)
				.setDescription(item.description)
				.setColor('RANDOM')
				.addFields(
					{ name: 'Item ID', value: item.id },
					{ name: 'Price', value: `<:AstralCoin:877583618770370582>${item.price}` },
					{ name: 'Sellable', value: item.sellable ? 'Yes' : 'No' },
					{ name: 'Usable', value: item.usable ? 'Yes' : 'No' },
				)
				.setFooter('/buy to buy an item')
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });
		}
		else {
			const items = client.economy.allItems();
			const fields = items.map((item) => {
				return {
					name: `${item.name} (${item.id})`,
					value: `<:AstralCoin:877583618770370582>${item.price} - ${item.description}`,
				};
			});
			const format = new MessageEmbed()
				.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
				.setTitle('Item Shop')
				.setDescription('You can see more specific information on each item by including its ID when running this command. Buy an item with /buy.')
				.setColor('RANDOM');
			const embeds = parsePages(fields, format);
			await pageMenu(interaction, embeds);
		}
	},
};
