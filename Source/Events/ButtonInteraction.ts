import { Interaction } from 'discord.js';
import { Event } from '../Typings/Event';

export const event: Event = {
	event: 'interactionCreate',
	async run(client, interaction: Interaction) {
		if (!interaction.isButton()) return;

	},
};