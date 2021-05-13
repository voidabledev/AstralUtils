const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModLog;

  let channel =
    message.mentions.channels.first() ||
    message.guild.channels.cache.get(args[0]);
  if (args[0] === "here") channel = message.channel;

  let modlog = {
    author: message.author.id,
    reason: "`No reason provided`",
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "Unlocked a channel",
  };

  if (!channel)
    return message.channel.send(
      em(
        `Failure!`,
        `You didn't provide a valid channel!`,
        `Use 'here' to unlock this channel.`,
        `#7a1b07`
      )
    );
  if (channel.permissionsFor(message.guild.roles.everyone).has("SEND_MESSAGES"))
    return message.channel.send(
      em(
        `Failure!`,
        `That channel isn't locked.`,
        `can't end something that doesn't exist`,
        `#7a1b07`
      )
    );
  channel.updateOverwrite(message.guild.roles.everyone, {
    SEND_MESSAGES: true,
  });
  if (message.channel.id !== channel.id)
    message.channel.send(
      em(`Success!`, `Unlocked ${channel}`, `spam go brrrrrr`, `#00ff66`)
    );
  channel.send(
    em(
      `Lockdown`,
      `This channel has been unlocked.`,
      `spam go brrrrrr`,
      `#00ff66`
    )
  );
  ml(userId, guildId, modlog, client);
};
exports.help = {
  name: "unlock",
  description: "unlocks a previously locked channel.",
  enabled: true,
  aliases: [],
  usage: "[channel]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: ["MANAGE_CHANNELS", "ADMINISTRATOR"], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 2,
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
