/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { ApplicationCommandOptionType as Options } from 'discord-api-types/v9';
import { MessageActionRow, MessageEmbed, MessageButton, MessageButtonStyleResolvable, EmojiResolvable, Message, ButtonInteraction } from 'discord.js';
import { success, fail, confirm } from '../../structures/embeds';
import { TicTacToe } from '../../structures/games';

export const command: Command = {
	name: 'ttt',
	description: 'Play a game of tic tac toe.',
	options: [
		{
			type: Options.User,
			name: 'user',
			description: 'The user you want to play against',
			required: true,
		},
		{
			type: Options.Integer,
			name: 'bet',
			description: 'The amount of coins you want to bet (max: 100.000). Omit this to play for fun.',
		},
	],
	async run(interaction, options, client) {
		const user = options.getUser('user');
		const bet = Math.max(Math.min(options.getInteger('bet'), 100_000), 0);
		if (user.bot) {
			return interaction.reply({
				embeds: [fail('You can\'t play against bots, you\'ll never hear back from them...')],
			});
		}
		if (bet) {
			const me = client.economy.getProfile(interaction.user.id);
			const you = client.economy.getProfile(user.id);
			if (me.coins < bet) {
				return interaction.reply({
					embeds: [fail('You don\'t even have that much, idiot')],
				});
			}
			if (you.coins < bet) {
				return interaction.reply({
					embeds: [fail(`${user} doesn't have that much, they wouldn't be able to pay you if you win.`)],
				});
			}
			try {
				await confirm(interaction, `${interaction.user}, are you sure you want to bet <:AstralCoin:877583618770370582>${bet} against ${user}?`);
				await confirm(interaction, `${user}, are you sure you want to bet <:AstralCoin:877583618770370582>${bet} against ${interaction.user}?`, false, user.id);
			}
			catch {
				return interaction.editReply({ embeds: [fail('Cancelled.')], components: [] });
			}
		}
		else {
			await interaction.reply('The game is starting, please wait...');
		}
		const message = <Message>(await interaction.fetchReply());
		const ttt = new TicTacToe();
		const rand = 0.5 - Math.random() > 0;
		const players = [rand ? interaction.user.id : user.id, rand ? user.id : interaction.user.id];
		let turn: 1 | -1 = 1;
		const index = (i: number): 0 | 1 => i === 1 ? 0 : 1;
		const styles: MessageButtonStyleResolvable[] = ['SUCCESS', 'SECONDARY', 'PRIMARY'];
		const emojis: EmojiResolvable[] = ['<:bluedot:842408037502550106>', '<:blank:883408864576421948>', '<:PinkDot:837340610591588414>'];
		const rows = () => [0, 1, 2].map((i) =>
			new MessageActionRow().addComponents(...[0, 1, 2].map((j) =>
				new MessageButton().setStyle(styles[ttt[i][j] + 1]).setEmoji(emojis[ttt[i][j] + 1]).setCustomId(`ttt-${i}-${j}`).setDisabled(ttt[i][j] !== 0),
			)),
		);
		const disabled = () => [0, 1, 2].map((i) =>
			new MessageActionRow().addComponents(...[0, 1, 2].map((j) =>
				new MessageButton().setStyle(styles[ttt[i][j] + 1]).setEmoji(emojis[ttt[i][j] + 1]).setCustomId(`ttt-${i}-${j}`).setDisabled(true),
			)),
		);
		try {
			while (ttt.state() === undefined) {
				await interaction.editReply({
					content: `<@${players[index(turn)]}>, it is your turn!`,
					components: rows(),
					embeds: [],
				});
				const button = await message.awaitMessageComponent<ButtonInteraction>({
					filter: (i) => {
						if (i.user.id === players[index(turn)]) {
							return true;
						}
						else {
							i.reply({
								content: 'It\'s not your turn.',
								ephemeral: true,
							});
							return false;
						}
					},
					time: 15_000,
				});
				await button.deferUpdate();
				const split = button.customId.split('-').map((x) => +x);
				split.shift();
				ttt[split[0]][split[1]] = <1 | -1>turn;
				turn *= -1;
			}
		}
		catch (e) {
			return interaction.editReply({
				content: 'Don\'t want to play? Alright.',
				components: disabled(),
			});
		}
		turn *= -1;
		await interaction.editReply({
			content: ttt.state() ? `<@${players[index(turn)]}> wins${bet ? ` <:AstralCoin:877583618770370582>${bet}` : ''}.` : 'The game ended in a draw.',
			components: disabled(),
		});
		if (bet && ttt.state()) {
			await client.economy.addCoins(players[index(turn)], bet);
			await client.economy.removeCoins(players[index(-turn)], bet);
		}
	},
};
