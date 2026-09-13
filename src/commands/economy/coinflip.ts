import { Command } from '../../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { MessageEmbed } from 'discord.js';
import { random } from '../../structures/utils';
import { fail, success } from '../../structures/embeds';

export const command: Command = {
	name: 'coinflip',
	description: 'Flip a coin, optionally multiple times.',
	options: [
		{
			type: Options.Integer,
			name: 'times',
			description: 'How many times to flip (1-10). Defaults to 1.',
			required: true,
		},
		{
			type: Options.String,
			name: 'bet',
			description: 'Optionally place a bet on the outcome (heads or tails).',
			required: false,
		},
	],
	async run(interaction, options, client) {
		const times = options.getInteger('times') ?? 1;
		const bet = options.getString('bet')?.toLowerCase();

		if (times < 1 || times > 10) {
			await interaction.reply({
				embeds:
        [fail('Please specify a number of flips between 1 and 10.')],
			});
			return;
		}

		let headsCount = 0;
		let tailsCount = 0;
		const flips: string[] = [];

		for (let i = 1; i <= times; i++) {
			const result = random(0, 1) === 0 ? 'Heads' : 'Tails';
			if (result === 'Heads') headsCount++;
			else tailsCount++;
			flips.push(`${i}. ${result}`);

			if (bet === result.toLowerCase()) {
				await interaction.reply({
					embeds:
        [success(`You won the bet! The result was ${result}.`)],
				});
				await client.economy.addCoins(interaction.user.id, 100);
			}
			else {
				await interaction.followUp({
					embeds:
        [fail(`You lost the bet. The result was ${result}.`)],
				});
				await client.economy.removeCoins(interaction.user.id, 100);
			}
		}

		const embed = new MessageEmbed()
			.setTitle('Coin Flip')
			.setDescription(flips.join('\n'))
			.setFooter(`Heads: ${headsCount} | Tails: ${tailsCount}`)
			.setColor('BLURPLE');

		await interaction.followUp({
			embeds: [embed],
		});
	},
};