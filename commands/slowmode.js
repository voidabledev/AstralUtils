const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModLog;

  const amount = parseInt(args[0]);
  if (isNaN(amount) || amount < 0)
    message.channel.send(
      em(
        `Success!`,
        `I need an amount to set the slowmode to.`,
        `duh`,
        `#7a1b07`
      )
    );
  let modlog = {
    author: message.author.id,
    reason: "Slowmode",
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "Changed slowmode in a channel",
  };
  message.channel.setRateLimitPerUser(amount);
  message.channel.send(
    em(
      `Success!`,
      `I've set the slowmode to ${amount} seconds.`,
      `spam dont go brrrrr`,
      `#00ff66`
    )
  );
  ml(userId, guildId, modlog, client);
};
exports.help = {
  name: "slowmode",
  description: "Sets the slowmode in a channel",
  enabled: true,
  aliases: ["slow", "sm"],
  usage: "[seconds]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 1,
  maxArgs: null,
};

exports.errors = {
  // edit this only if you want a custom message for this specific command.
  userPerms: null, // Else, it will default to an embed.
  botPerms: null,
  wrongUsage: null,
  disabled: null,
  other: null,
};
