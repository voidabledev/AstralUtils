import { Client, Intents } from 'discord.js';
import { token } from './config.json';

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
	]
});

client.once('ready', () => console.log(`Ready! Logged in as ${client.user?.tag}!`));

client.login(token);