import { Event } from '../typings/event';
import { ThreadChannel } from 'discord.js';

export const event: Event = {
	event: 'threadCreate',
	async run(client, thread: ThreadChannel) {
		if (thread.joinable && !thread.joined) thread.join();
	},
};
