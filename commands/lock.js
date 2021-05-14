const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModLog;

  const channelID = args.shift();
  const reason = args.join(" ");
  let channel =
    message.mentions.channels.first() ||
    message.guild.channels.cache.get(channelID);
  if (channelID === "here") channel = message.channel;

  let modlog = {
    author: message.author.id,
    reason,
    channel,
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "Lock",
  };

  if (!channel)
    return message.channel.send(
      em(
        `Failure!`,
        `You didn't provide a valid channel!`,
        `Use 'here' to lock this channel.`,
        `#7a1b07`
      )
    );
  if (
    !channel.permissionsFor(message.guild.roles.everyone).has("SEND_MESSAGES")
  )
    return message.channel.send(
      em(
        `Failure!`,
        `That channel is already locked.`,
        `sorry no double lockdown`,
        `#7a1b07`
      )
    );
  channel.updateOverwrite(message.guild.roles.everyone, {
    SEND_MESSAGES: false,
  });
  if (message.channel.id !== channel.id)
    message.channel.send(
      em(
        `Success!`,
        `Locked down ${channel}`,
        `manage channel perms abuse go brrrrrr`,
        `#00ff66`
      )
    );
  channel.send(
    em(
      `Lockdown`,
      `This channel has been locked down for:\n${reason}`,
      `manage channel perms abuse go brrrrrr`,
      `#00ff66`
    )
  );
  ml(channelID, modlog, client);
};
exports.help = {
  name: "lock",
  description: "Locks a channel.",
  enabled: true,
  aliases: ["l"],
  usage: "[channel] [reason]",
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
