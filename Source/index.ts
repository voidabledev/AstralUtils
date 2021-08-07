import { Client } from './Modules/Client';
import { Intents } from 'discord.js';

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.start();
