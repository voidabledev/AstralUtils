/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageActionRow, Message, MessageButton, MessageEmbed, ButtonInteraction } from 'discord.js';
import { fail, success } from '../../structures/embeds';
import { Command } from '../../typings/command';
import { WorkOutCome } from '../../typings/outcomes';

const outcomes: WorkOutCome[] = [
	{
		display: 'You did a TERRIBLE job and didn\'t get any money.',
		style: 'DANGER',
		emoji: '<:blank:883408864576421948>',
		run: () => null,
	},
	{
		display: 'You did a decent job and got <:AstralCoin:877583618770370582>2000 for half an hour of work.',
		style: 'PRIMARY',
		emoji: '<:AstralCoin:877583618770370582>',
		run: (client, userId) => client.economy.addCoins(userId, 2000),
	},
	{
		display: 'You did a decent job and got <:AstralCoin:877583618770370582>2000 for half an hour of work.',
		style: 'PRIMARY',
		emoji: '<:AstralCoin:877583618770370582>',
		run: (client, userId) => client.economy.addCoins(userId, 2000),
	},
	{
		display: 'You did a good job and got <:AstralCoin:877583618770370582>7500 for half an hour of work.',
		style: 'SUCCESS',
		emoji: '<:2_astral_coins:883631908137869342>',
		run: (client, userId) => client.economy.addCoins(userId, 7500),
	},
	{
		display: 'You did an AMAZING job and got <:AstralCoin:877583618770370582>15000 for half an hour of work.',
		style: 'SUCCESS',
		emoji: '<:3_astral_coins:883631995597488218>',
		run: (client, userId) => client.economy.addCoins(userId, 15000),
	},
];

export const command: Command = {
	name: 'work',
	description: 'Work to get some money.',
	category: 'Economy',
	cooldown: 60_000 * 30,
	async run(interaction, options, client) {
		const order = outcomes.sort(() => 0.5 - Math.random());
		const hidden = new MessageActionRow().addComponents(...order.map((_, i) => new MessageButton().setCustomId(`${i}`).setStyle('PRIMARY').setEmoji('<:blank:883408864576421948>')));
		const shown = new MessageActionRow().addComponents(...order.map((outcome, i) => new MessageButton().setStyle('SECONDARY').setCustomId(`${i}`).setEmoji(outcome.emoji).setDisabled(true)));
		const m = (await interaction.reply({
			embeds: [new MessageEmbed().setColor('GREEN').setDescription('Select a field to reveal your salary.')],
			components: [hidden],
			fetchReply: true,
		})) as Message;
		let ended = false;
		const collector = m.createMessageComponentCollector({ time: 20_000, filter: (i) => i.user.id === interaction.user.id });

		collector.on('collect', async (i: ButtonInteraction) => {
			i.deferUpdate();
			ended = true;
			collector.stop();
			const j = +i.customId;
			const outcome = order[j];
			outcome.run(client, interaction.user.id);
			(<MessageButton>shown.components[j]).setStyle(outcome.style);
			const embed = outcome.style === 'DANGER' ? fail : success;
			await interaction.editReply({
				embeds: [embed(outcome.display)],
				components: [shown],
			});
		});
		collector.on('end', async () => {
			if (ended) return;
			interaction.editReply({
				embeds: [fail('You came late for work. Sucks, now you don\'t get anything.')],
				components: [],
			});
		});
	},
};