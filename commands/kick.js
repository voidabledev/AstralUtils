const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModlog;

  const { member, mentions } = message;

  let target = mentions.users.first();
  if (!target) target = await message.guild.members.fetch(args[0]);
  if (target) {
    const targetMember = await message.guild.members.fetch(target.id);
    if (!targetMember.manageable || targetMember.id === message.author.id)
      return message.channel.send(
        em(`Too strong!`, `I can't kick that user!`, `hehe boi`, `#7a1b07`)
      );
    const embed = new MessageEmbed()
      .setDescription(
        `You have been kicked from **${message.guild.name}** for \`${reason}\``
      )
      .setColor("RED");
    await target.send(embed);
    targetMember.kick();
    message.channel.send(
      em(`Success!`, `${target} was kicked.`, `lol`, `#00ff66`)
    );
  } else {
    return message.channel.send(
      em(
        `Failure!`,
        `You did not provide a user!`,
        `kick don't go brrr`,
        `#7a1b07`
      )
    );
  }
  let reason = "";
  if (!args[1]) reason = "`No reason provided`";
  else reason = `\`${args.slice(1).join(" ")}\``;
  const userId = target.id;
  const guildId = message.guild.id;
  let modlog = {
    author: message.author.id,
    reason,
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "kick",
  };
  ml(userId, guildId, modlog, client);
};
exports.help = {
  name: "kick",
  description: "Kicks a member.",
  enabled: true,
  aliases: ["k"],
  usage: "[member]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["KICK_MEMBERS", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: ["KICK_MEMBERS", "ADMINISTRATOR"],
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
