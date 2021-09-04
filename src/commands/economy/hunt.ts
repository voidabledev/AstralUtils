/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageActionRow, Message, MessageButton, MessageEmbed } from 'discord.js';
import { random, setCharAt, wait } from '../../structures/utils';
import { fail, success } from '../../structures/embeds';
import { Client } from '../../structures/client';
import { Command } from '../../typings/command';

const outcomes: { display: string; chance: number; run: (client: Client, userId: string) => Promise<unknown> }[] = [
	{
		display: 'a dragon',
		chance: 1 / 117,
		run: (client, userId) => client.economy.addItem(userId, 'dragon', 1),
	},
	{
		display: 'a lion',
		chance: 4 / 117,
		run: (client, userId) => client.economy.addItem(userId, 'lion', 1),
	},
	{
		display: 'a monkey',
		chance: 8 / 117,
		run: (client, userId) => client.economy.addItem(userId, 'monkey', 1),
	},
	{
		display: 'a boar',
		chance: 8 / 117,
		run: (client, userId) => client.economy.addItem(userId, 'boar', 1),
	},
	{
		display: 'a deer',
		chance: 16 / 117,
		run: (client, userId) => client.economy.addItem(userId, 'deer', 1),
	},
	{
		display: 'a rabbit',
		chance: 16 / 117,
		run: (client, userId) => client.economy.addItem(userId, 'rabbit', 1),
	},
	{
		display: 'a squirrel',
		chance: 32 / 117,
		run: (client, userId) => client.economy.addItem(userId, 'squirrel', 1),
	},
	{
		display: 'a duck',
		chance: 32 / 117,
		run: (client, userId) => client.economy.addItem(userId, 'duck', 1),
	},
];
export const command: Command = {
	name: 'hunt',
	description: 'Hunt animals in the forest.',
	cooldown: 30000,
	async run(interaction, options, client) {
		const profile = client.economy.getProfile(interaction.user.id);
		if (!client.economy.hasAbility(Object.keys(profile.itemIds), 'hunt')) {
			return interaction.reply({
				embeds: [fail('You can\'t hunt without a rifle!')],
			});
		}

		if (Math.random() < 0.01) {
			client.economy.removeItem(interaction.user.id, 'rifle', 1);
			return interaction.reply({
				embeds: [fail('Too bad, your rifle broke')],
			});
		}

		const forest = '🌲🎄🌳🌴🌲\n🌲🌳🌴🎋🎄\n🌳🌲🟦🎋🌴\n🌴🎋🌲🌳🌳\n🌲🎋🌳🌲🌳';

		const m = (await interaction.reply({
			content: forest,
			components: [
				new MessageActionRow().addComponents([new MessageButton().setCustomId(`shoot-${interaction.id}`).setLabel('Shoot').setStyle('SUCCESS')]),
			],
			fetchReply: true,
		})) as Message;

		const collector = m.createMessageComponentCollector({ time: 1000 * 15, filter: (i) => i.user.id === interaction.user.id });

		let animalShown = false;
		let ended = false;

		collector.on('collect', async i => {
			ended = true;
			if (!animalShown) {
				collector.stop();
			  await	i.update({ content: null, embeds: [fail('You missed.')], components: [] });
				return;
			}

			const roll = Math.random();
			let count = 0;
			let outcome: typeof outcomes[0];
			for (const that of outcomes) {
				count += that.chance;
				if (roll < count) {
					outcome = that;
					break;
				}
			}
			await outcome.run(client, interaction.user.id);
			await i.update({
				content: null,
				embeds: [success(`You went hunting in the forest and brought back ${outcome.display}!`)],
				components: [],
			});
		});

		collector.on('end', async () => {
			if (ended) return;
			ended = true;
			await interaction.editReply({
				content: null,
				embeds: [fail('You didn\'t shoot in time.')],
				components: [],
			});
		});

		const appearAnimal = async () => {
			if (ended) return;
			let rand = 0;
			do {
				rand = random(0, forest.length - 1);
			} while(forest.charAt(rand) === '\n');
		  if (m.editable)	{
				await m.edit({
					content: setCharAt(forest, rand, '🐒'),
				});
			}
			animalShown = true;
			await wait(850);
			if (ended) return;
			if (m.editable) {
				await m.edit({
					content: forest,
				});
			}
			animalShown = false;
		};

		while (!ended) {
			if (ended) return;
			await wait(3000 + Math.round(Math.random() * 1000));
		  await	appearAnimal();
		}
	},
};