/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { MessageEmbed } from 'discord.js';
import { success, fail } from '../../modules/embeds';

export const command: Command = {
	name: 'gamble',
	description: 'Play a gambling game.',
	options: [
		{
			type: Options.Integer,
			name: 'bet',
			description: 'The amount of coins you want to bet (max: 100.000)',
			required: true,
		},
	],
	async run(interaction, options, client) {
		const bet = Math.min(options.getInteger('bet', true), 100_000);
		const profile = client.economy.getProfile(interaction.user.id);
		if (bet < 1) {
			return interaction.reply({
				embeds: [fail('You can\'t bet your debts!')],
			});
		}
		if (profile.coins < bet) {
			return interaction.reply({
				embeds: [fail('You don\'t have that much money!')],
			});
		}
		const rolls = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];

		const embed = new MessageEmbed()
			.setAuthor(`${interaction.user.username}'s gambling game`, interaction.user.displayAvatarURL({ dynamic: true }))
			.addFields(
				{ name: `${interaction.user.username}'s roll`, value: `${rolls[0]}` },
				{ name: `${client.user.username}'s roll`, value: `${rolls[1]}` },
			)
			.setTimestamp();

		if (rolls[0] < rolls[1]) {
			embed
				.setColor('RED')
				.setDescription(`**You lose!** You lost <:AstralCoin:877583618770370582>${bet}.`)
				.setFooter('Imagine being this bad');
			await client.economy.removeCoins(interaction.user.id, bet);
		}
		if (rolls[0] === rolls[1]) {
			embed
				.setColor('ORANGE')
				.setDescription('**Tie!** Your balance hasn\'t changed.')
				.setFooter('At least you get your coins back');
		}
		if (rolls[0] > rolls[1]) {
			embed
				.setColor('GREEN')
				.setDescription(`**You win!** You won <:AstralCoin:877583618770370582>${bet}.`)
				.setFooter('Imagine being this lucky');
			await client.economy.addCoins(interaction.user.id, bet);
		}
		await interaction.reply({ embeds: [embed] });
	},
};
