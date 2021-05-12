require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");
const Enmap = require("enmap");
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`Loaded ${commandName}`);
    client.commands.set(commandName, props);
  });
});

require("./utils/functions.js")(client);

client.config = config;
if (process.argv[2] === "dev") client.config.prefix = client.config.devPrefix;
require("./utils/interval.js")(client);

client.login(process.env.TOKEN);
