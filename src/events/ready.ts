import { Event } from '../typings/event';

export const event: Event = {
	event: 'ready',
	once: true,
	async run(client) {
		console.log(`Ready! Logged in as ${client.user?.tag}!`);
		await client.economy.cache();
	},
};
