// Packages...
const Discord = require('discord.js');
const client = new Discord.Client();
const conf = require('./json/configuration.json');
const fs = require('fs');
const mongoose = require('mongoose');

global.aliases = require('./json/aliases.json');
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}
client.commands = new Discord.Collection();
let cmds = 0;
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.help.name, command);
		cmds++;
	}
}
console.log(`Loaded ${cmds} commands.`);
client.cooldowns = new Discord.Collection();
mongoose.connect(conf.db, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	keepAlive: true,
});
client.snipes = new Discord.Collection();
client.login(conf.token);
