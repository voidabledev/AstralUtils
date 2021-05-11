const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (client, message, args) => {
  var timeNow = Date.now();
  var m = await message.channel.send("Pinging...");
  var messageLat = Date.now() - timeNow;
  var ping = ms(client.uptime);

  let e = new Discord.MessageEmbed()
    .addField("Client Ping", `${Math.round(client.ws.ping)}ms`, true)
    .addField("Message Latency", `${messageLat}ms`, true)
    .addField("Uptime:", ping)
    .setColor("RANDOM");
  m.edit(e);
};
module.exports.help = {
  name: "ping",
  description: "Displays the bot latency.",
  enabled: true,
  usage: "",
  category: "Information",
};

exports.data = {
  userPermissions: [],
  userMode: 0, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [],
  botMode: 0, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 0,
  maxArgs: null,
};

exports.errors = {
  // edit this only if you want a custom message for this specific command.
  userPerms: null, // Else, it will default to an embed
  botPerms: null,
  wrongUsage: null,
  disabled: null,
  other: null,
};
