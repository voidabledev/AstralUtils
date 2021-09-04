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
	],
	allowedMentions: {
		parse: ['users', 'roles'],
	},
});

client.start();
