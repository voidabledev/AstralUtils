const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModlog;

  const { member, mentions } = message;

  let target = message.mentions.users.first();
  if (!target) target = await client.users.fetch(args[0]);
  let time = client.millis(args[1]);
  if (time > 0) args.shift();
  let reason = "";
  if (!args[1]) reason = "`No reason provided`";
  else reason = `\`${args.slice(1).join(" ")}\``;
  if (target) {
    const id = target.id;
    if (id === message.author.id) {
      return message.channel.send(
        em(
          `Failure!`,
          `You can't ban yourself!`,
          "what are you, stupid?",
          "RANDOM"
        )
      );
    }
    const embed = new MessageEmbed()
      .setDescription(
        `You have been banned from **${message.guild.name}** for \`${reason}\``
      )
      .setColor("RED");
    try {
      await target.send(embed);
    } catch (e) {
      console.error(e);
    }
    message.guild.members
      .ban(id)
      .then(() =>
        message.channel.send(
          em(
            `Success!`,
            `${target} has been banned.`,
            `haha ban abuse go brrrr`,
            `#00ff66`
          )
        )
      )
      .catch(() => {
        message.channel.send(
          em(`Failure!`, `I can't ban that user!`, `brrrrrr`, `RED`)
        );
      });
  } else {
    return message.channel.send(
      em(
        `Failure`,
        `Please specify someone to go brrrr`,
        `failed to abuse power. what a shame...`,
        `#7a1b07`
      )
    );
  }
  const userId = target.id;
  const guildId = message.guild.id;
  let modlog = {
    author: message.author.id,
    reason,
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "Ban",
  };
  ml(userId, guildId, modlog, client);
  if (time > 0) {
    let timestamp = new Date().setTime(new Date().getTime() + time);
    client.addTimer("ban", userId, guildId, timestamp);
  }
};
exports.help = {
  name: "ban",
  description: "Bans a member.",
  enabled: true,
  aliases: ["b"],
  usage: "[user]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
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
