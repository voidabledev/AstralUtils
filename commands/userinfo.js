const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const guild = message.guild;
  const usr = message.mentions.users.first() || message.author;

  const member =
    message.mentions.members.first() ||
    (await message.guild.members.fetch(args[0]));

  const user = member.user;

  const embed = new Discord.MessageEmbed()
    .setAuthor(`${usr.tag}`, `${usr.displayAvatarURL({ dynamic: true })}`)
    .setThumbnail(`${usr.displayAvatarURL({ dynamic: true })}`)
    .setDescription(`${usr}'s Information`)
    .addField(`**ID:**`, `${usr.id}`)
    .addField(
      `**Nickname:**`,
      `${member.nickname || `**Cannot Find A Nickname For This User**`}`
    )
    .addField(`**Joined Server:**`, `${member.joinedAt}`)
    .addField(`**Joined Discord:**`, `${usr.createdAt}`)
    .addField(`**Status:**`, `${user.presence.status}`)
    .setColor("RANDOM");
  message.channel.send(embed);
};

exports.help = {
  name: "userinfo",
  description: "Displays information about a user",
  enabled: true,
  aliases: ["ui"],
  usage: "[user]",
  category: "Misc",
};

exports.data = {
  userPermissions: [],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 1,
  maxArgs: null,
  noDel: false, // change this to true if the command belongs to the "Moderation" category
}; // and you don't want to og message to be deleted.

exports.errors = {
  // edit this only if you want a custom message for this specific command.
  userPerms: null, // Else, it will default to an embed.
  botPerms: null,
  wrongUsage: null,
  disabled: null,
  other: null,
};
