/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageActionRow, Message, MessageButton, MessageEmbed } from 'discord.js';
import { random, setCharAt, wait } from '../../structures/utils';
import { fail } from '../../structures/embeds';
import { Client } from '../../structures/client';
import { Command } from '../../typings/command';

const outcomes: { display: string; chance: number; run: (client: Client, userId: string) => Promise<unknown> }[] = [
	{
		display: 'nothing',
		chance: 0.99,
		run: () => null,
	},
	{
		display: 'a dragon',
		chance: 0.01,
		run: (client, userId) => client.economy.addItem(userId, 'dragon', 1),
	},
];
export const command: Command = {
	name: 'hunt',
	description: 'Hunt animals in the forest.',
	cooldown: 3000,
	async run(interaction, options, client) {
		const profile = client.economy.getProfile(interaction.user.id);
		if (!client.economy.hasAbility(Object.keys(profile.itemIds), 'hunt')) {
			return interaction.reply({
				embeds: [fail('You can\'t hunt without a rifle!')],
			});
		}

		const forest = `
🌲🌳🌴🎋🎄
🌳🌲🟦🎋🌴
🌴🎋🌲🌳🌳
🌲🎋🌳🌲🌳
`;

		const embed = (str) => {
			return new MessageEmbed().setColor('GREEN').setDescription(str);
		};

		const m = (await interaction.reply({
			embeds: [embed(forest)],
			components: [
				new MessageActionRow().addComponents([new MessageButton().setCustomId('shoot').setLabel('Shoot').setStyle('SUCCESS')]),
			],
			fetchReply: true,
		})) as Message;

		const collector = m.createMessageComponentCollector({ time: 1000 * 15 });

		let animalShown = false;
		let ended = false;

		collector.on('collect', async i => {
			ended = true;
			if (!animalShown) {
				collector.stop();
			  await	i.update({ embeds: [fail('You missed.')], components: [] });
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
				embeds: [embed(`You went hunting in the forest and brought back ${outcome.display}!`)],
				components: [],
			});
		});

		collector.on('end', async () => {
			if (ended) return;
			ended = true;
			await interaction.editReply({
				embeds: [fail('You didn\'t shoot in time.')],
				components: [],
			});
		});

		const appearAnimal = async () => {
			if (ended) return;
		  if (m.editable)	{
				await m.edit({
					embeds: [m.embeds[0].setDescription(setCharAt(forest, random(5, 15), '🐒'))],
				});
			}
			animalShown = true;
			await wait(1000);
			if (ended) return;
			if (m.editable) {
				await m.edit({
					embeds: [embed(forest)],
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