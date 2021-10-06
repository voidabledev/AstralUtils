import { Event } from '../typings/event';
import { activity } from '../structures/utils';

export const event: Event = {
	event: 'ready',
	once: true,
	async run(client) {
		console.log(`Ready! Logged in as ${client.user?.tag}.`);
		await client.economy.cache();
		client.user.setStatus("online");
		activity(client);
		setInterval(() => activity(client), 1000 * 60 * 5);
	},
};
