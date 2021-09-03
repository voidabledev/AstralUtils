/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageActionRow, Message, MessageButton, MessageEmbed } from 'discord.js';
import { random, setCharAt, wait } from '../../structures/utils';
import { fail, success } from '../../structures/embeds';
import { Client } from '../../structures/client';
import { Command } from '../../typings/command';

const outcomes: { display: string; chance: number; run: (client: Client, userId: string) => Promise<unknown> }[] = [
	{
		display: 'a time capsule, what the hell?',
		chance: 1 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'timecapsule', 1),
	},
	{
		display: 'a stick bug',
		chance: 4 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'stickbug', 1),
	},
	{
		display: 'a shovel',
		chance: 8 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'shovel', 1),
	},
	{
		display: 'a seed',
		chance: 8 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'seed', 1),
	},
	{
		display: 'a piece of dirt',
		chance: 8 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'dirt', 1),
	},
	{
		display: 'a piece of junk',
		chance: 16 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'junk', 1),
	},
	{
		display: 'a common fish',
		chance: 16 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'commonfish', 1),
	},
	{
		display: 'a spider, ew',
		chance: 32 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'spider', 1),
	},
	{
		display: 'two pieces of garbage',
		chance: 32 / 125,
		run: (client, userId) => client.economy.addItem(userId, 'garbage', 2),
	},
];
export const command: Command = {
	name: 'dig',
	description: 'Use your shovel to dig for items inside the ground.',
	cooldown: 3000,
	async run(interaction, options, client) {
		const profile = client.economy.getProfile(interaction.user.id);
		if (!client.economy.hasAbility(Object.keys(profile.itemIds), 'dig')) {
			return interaction.reply({
				embeds: [fail('You can\'t dig with your bare hands, you need a shovel!')],
			});
		}

		if (Math.random() < 0.01) {
			client.economy.removeItem(interaction.user.id, 'shovel', 1);
			return interaction.reply({
				embeds: [fail('Too bad, your shovel broke')],
			});
		}

		const row = () => new MessageActionRow().addComponents([0,
			1, 2, 3, 4].map((i) => new MessageButton().setCustomId(`dig-${i}`).setEmoji	('<:no_diglett:883392536297750628>').setStyle('SUCCESS')));

		const m = (await interaction.reply({
			content: '\u200b',
			components: [row()],
			fetchReply: true,
		})) as Message;

		const collector = m.createMessageComponentCollector({ time: 1000 * 20, filter: (i) => i.user.id === interaction.user.id });

		let animalShown = false;
		let ended = false;
		let index = -1;

		collector.on('collect', async i => {
			ended = true;
			const j = i.customId.charAt(4);
			if (!animalShown) {
				collector.stop();
			  await	i.update({ embeds: [fail('You dug in the ground, but couldn\'t find anything.')], components: [] });
				return;
			}

			if (+j !== index) {
				collector.stop();
			  await	i.update({ embeds: [fail('You dug in the wrong place, so you found nothing.')], components: [] });
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
				embeds: [success(`You dug in the ground and found ${outcome.display}!`)],
				components: [],
			});
		});

		collector.on('end', async () => {
			if (ended) return;
			ended = true;
			await interaction.editReply({
				embeds: [fail('You didn\'t start digging in time.')],
				components: [],
			});
		});

		const appearAnimal = async () => {
			if (ended) return;
			index = random(0, 4);
		  if (m.editable)	{
				await m.edit({
					components: [row().spliceComponents(index, 1, (<MessageButton>row().components[index]).setEmoji('<:diglett:883391962634412032>'))],
				});
			}
			animalShown = true;
			await wait(1000);
			if (ended) return;
			if (m.editable) {
				await m.edit({
					components: [row()],
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