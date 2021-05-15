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
client.config = config;
require("./mongo")().then(() => console.log("Connected to mongoose"));
require("./utils/functions.js")(client);

const { GiveawaysManager } = require("discord-giveaways");
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./giveaways.js",
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    embedColor: "#00ff66",
    reaction: "🎉",
  },
});
client.giveawaysManager.on(
  "giveawayReactionAdded",
  async (giveaway, member, reaction) => {
    if (await client.blacklisted(member.id)) {
      return reaction.message.reactions
        .resolve(reaction)
        .users.remove(member.id);
    }
    console.log(
      `${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`
    );
  }
);

client.giveawaysManager.on(
  "giveawayReactionRemoved",
  (giveaway, member, reaction) => {
    console.log(
      `${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`
    );
  }
);

client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
  console.log(
    `Giveaway #${giveaway.messageID} ended! Winners: ${winners
      .map((member) => member.user.username)
      .join(", ")}`
  );
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

client.config = config;
if (process.argv[2] === "dev") client.config.prefix = client.config.devPrefix;
require("./utils/interval.js")(client);

client.login(process.env.TOKEN);
