/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command } from '../../typings/command';
import { Client } from '../../structures/client';
import { MessageEmbed, MessageActionRow, MessageButton, Message } from 'discord.js';
import { success, fail } from '../../structures/embeds';
import { textChangeRangeIsUnchanged } from 'typescript';
import{}from ""../../structures

const outcomes: { display: string; chance: number; run: (client: Client, userId: string) => Promise<unknown> }[] = [
	{
		display: 'Nothing',
		chance: 0.4,
		run: () => null,
	},
	{
		display: '3 common fish',
		chance: 0.2,
		run: (client, userId) => client.economy.addItem(userId, 'commonfish', 3),
	},
	{
		display: '1 rare fish',
		chance: 0.1,
		run: (client, userId) => client.economy.addItem(userId, 'rarefish', 1),
	},
	{
		display: 'a fishing rod, what the hell!?',
		chance: 0.1,
		run: (client, userId) => client.economy.addItem(userId, 'fishrod', 1),
	},
	{
		display: 'some garbage',
		chance: 0.2,
		run: (client, userId) => client.economy.addItem(userId, 'garbage', 1),
	},
];

export const command: Command = {
	name: 'hunt',
	description: 'Use your rifle.',
	async run(interaction, options, client) {
		const profile = client.economy.getProfile(interaction.user.id);

		if (!client.economy.hasAbility(Object.keys(profile.itemIds), 'hunt')) {
			return interaction.reply({
				embeds: [fail('You can\'t hunt without a rifle!')],
			});
		}

		const setCharAt = (str, index, chr) => {
			if(index > str.length - 1) return str;
			return str.substring(0, index) + chr + str.substring(index + 1);
		};


	  const m =	(await interaction.reply({
			embeds: [success('')],
			components: [new MessageActionRow().addComponents([
				new MessageButton().setCustomId('shoot').setLabel('Shoot').setStyle('SUCCESS'),
			])],
			fetchReply: true,
		})) as Message;

		const collector = m.createMessageComponentCollector();

		let animalShown = false;

		collector.on('collect', i => {
			if (!animalShown) {
				collector.stop();
				i.reply({ embeds: [fail('You missed')] });
				return;
			}
		});
	},
};
