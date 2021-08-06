import { Client, Intents } from 'discord.js';
import { token, db } from './config.json';
import { connect } from 'mongoose';

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
	]
});

client.once('ready', () => console.log(`Ready! Logged in as ${client.user?.tag}!`));

connect(db, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	keepAlive: true,
});

client.login(token);