import { Event } from '../typings/event';
import { Message } from 'discord.js';

export const event: Event = {
	event: 'messageCreate',
	async run(client, message: Message) {
		if (message.guild) return;
	},
};