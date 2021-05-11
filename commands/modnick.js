const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModlog;

  let target = message.mentions.members.first();
  if (!target) {
    target = await message.guild.members.fetch(args[0]);
  }
  if (!target) {
    return message.channel.send(
      em(
        `Failure!`,
        `You didn't provide a user.`,
        `stop being a prick`,
        `#7a1b07`
      )
    );
  }
  if (!target.manageable)
    return message.channel.send(
      em(`Failure!`, `I can't edit that user's nickname!`, `lmao`, `#7a1b07`)
    );
  let id = Math.floor(Math.random() * 0x1000000).toString(16);
  while (id.length < 6) {
    id = "0" + id;
  }
  target.setNickname(`Moderated Nickname ${id}`);
  message.channel.send(
    em(
      `Success!`,
      `Moderated ${target}'s nickname`,
      `unpingable nicknames don't go brrr`,
      `#00ff66`
    )
  );
  const userId = target.id;
  const guildId = message.guild.id;
  let modlog = {
    author: message.author.tag,
    reason: `\`No reason provided\``,
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "modnick",
  };
  ml(userId, guildId, modlog, client);
};

exports.help = {
  name: "modnick",
  description: "Moderates a user's nickname.",
  enabled: true,
  aliases: ["mod"],
  usage: "[mention or id]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_NICKNAMES", "ADMINISTRATOR", "MANAGE_GUILD"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: ["MANAGE_NICKNAMES", "ADMINISTRATOR"],
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
