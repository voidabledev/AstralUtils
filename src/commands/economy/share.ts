/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { MessageEmbed } from 'discord.js';
import { success, fail } from '../../structures/embeds';

export const command: Command = {
	name: 'share',
	description: 'Give coins from your wallet to someone else.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user you want to give the item to',
			required: true,
		},
		{
			type: Options.Integer,
			name: 'amount',
			description: 'How many coins you want to share.',
			required: true,
		},
	],
	async run(interaction, options, client) {
		const user = options.getUser('user', true).id;
		const amount = options.getInteger('amount', true);
		const me = client.economy.getProfile(interaction.user.id);
		const you = client.economy.getProfile(user);
		if (amount < 1) {
			return interaction.reply({
				embeds: [fail('Don\'t try to break me, you have to share a positive amount of coins.')],
			});
		}
		if (me.coins < amount) {
			return interaction.reply({
				embeds: [fail(`You can't give <:AstralCoin:877583618770370582>${amount}, because you don't have that much!`)],
			});
		}
		if (me.userId === you.userId) {
			return interaction.reply({
				embeds: [fail('You can\'t give coins to yourself!')],
			});
		}
		await client.economy.removeCoins(me.userId, amount);
		await client.economy.addCoins(you.userId, amount);
		await interaction.reply({
			embeds: [success(`You shared <:AstralCoin:877583618770370582>${amount} with <@${user}>.`)],
		});
	},
};
