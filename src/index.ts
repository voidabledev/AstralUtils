import { Client } from './structures/client';
import { Intents } from 'discord.js';

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_INVITES,
	],
	partials: [
		'CHANNEL',
		'MESSAGE',
		'USER',
		'GUILD_MEMBER',
	],
	allowedMentions: {
		parse: ['users', 'roles', 'everyone'],
		repliedUser: true,
	},
});

process.on('unhandledRejection', async (reason: Error, promise: Promise<unknown>) => {
	console.error('Unhandled promise rejection at: ', promise, 'Reason: ', reason);
});

client.start();
