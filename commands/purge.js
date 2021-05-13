const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModLog;

  const amount = parseInt(args[0], 10);
  if (isNaN(amount))
    return message.channel.send(
      em(
        `Failure!`,
        `You didn't provide a valid number of messages to purge.`,
        `can't even use basic mod commands`,
        `#7a1b07`
      )
    );
  message.channel.bulkDelete(amount + 1).then(() => {
    message.channel
      .send(
        em(
          `Success!`,
          `Purged ${amount} messages`,
          `manage messages abuse go brrrr`,
          `#00ff66`
        )
      )
      .then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 2000);
      });
  });
  let modlog = {
    author: message.author.id,
    reason: "Too much messages",
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "Purged messages",
  };
  ml(userId, guildId, modlog, client);
  return;
};
exports.help = {
  name: "purge",
  description: "Purges the amount of messages given.",
  enabled: true,
  aliases: ["prune", "clear"],
  usage: "[number of messages]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"], // if no permissions are required, leave the array empty and set the Mode to 0
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
