/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageActionRow, Message, MessageButton } from 'discord.js';
import { random, setCharAt, wait } from '../../structures/utils';
import { fail, success } from '../../structures/embeds';
import { Command } from '../../typings/command';
import { NormalOutCome } from '../../typings/outcomes';

const outcomes: NormalOutCome[] = [
	{
		display: 'a legendary fish',
		chance: 1 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'legendaryfish', 1),
	},
	{
		display: 'a whale',
		chance: 4 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'whale', 1),
	},
	{
		display: 'an epic fish',
		chance: 8 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'epicfish', 1),
	},
	{
		display: 'a fishing rod',
		chance: 8 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'fishrod', 1),
	},
	{
		display: 'a rare fish',
		chance: 8 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'rarefish', 1),
	},
	{
		display: 'a jelly fish',
		chance: 16 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'jellyfish', 1),
	},
	{
		display: 'a common fish',
		chance: 16 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'commonfish', 1),
	},
	{
		display: 'a pair of old shoes',
		chance: 32 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'shoes', 1),
	},
	{
		display: 'a piece of garbage',
		chance: 32 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'garbage', 1),
	},
];
export const command: Command = {
	name: 'fish',
	description: 'Use your fishing rod to find fish in the sea.',
	cooldown: 30000,
	async run(interaction, options, client) {
		const profile = client.economy.getProfile(interaction.user.id);
		if (!client.economy.hasAbility(Object.keys(profile.itemIds), 'fish')) {
			return interaction.reply({
				embeds: [fail('You can\'t fish without a rod!')],
			});
		}

		if (Math.random() < 0.01) {
			client.economy.removeItem(interaction.user.id, 'fishrod', 1);
			return interaction.reply({
				embeds: [fail('Too bad, your fishing rod broke')],
			});
		}

		const sea = '🦞🌊🌊🌊🌊\n🌊🌊🌊🌊🏖\n🌊🌊🏝🌊🌊\n🌊🌊🌊🦞🌊\n🦞🌊🌊🌊🌊';

		const m = (await interaction.reply({
			content: sea,
			components: [
				new MessageActionRow().addComponents([new MessageButton().setCustomId(`fish-${interaction.id}`).setLabel('Cast Out').setStyle('SUCCESS')]),
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
			  await	i.update({ content: null, embeds: [fail('You cast out the line, but you didn\'t catch anything.')], components: [] });
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
				embeds: [success(`You went fishing at the sea and brought back ${outcome.display}!`)],
				components: [],
			});
		});

		collector.on('end', async () => {
			if (ended) return;
			ended = true;
			await interaction.editReply({
				content: null,
				embeds: [fail('You didn\'t cast out in time.')],
				components: [],
			});
		});

		const appearAnimal = async () => {
			if (ended) return;
			let rand = 0;
			do {
				rand = random(0, sea.length - 1);
			} while(sea.charAt(rand) === '\n');
		  if (m.editable)	{
				await m.edit({
					content: setCharAt(sea, rand, '🐟'),
				});
			}
			animalShown = true;
			await wait(700);
			if (ended) return;
			if (m.editable) {
				await m.edit({
					content: sea,
				});
			}
			animalShown = false;
		};

		while (!ended) {
			if (ended) break;
			await wait(3000 + Math.round(Math.random() * 1000));
		  await	appearAnimal();
		}
	},
};