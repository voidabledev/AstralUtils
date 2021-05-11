const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const { member } = message;
  const embed = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setDescription(args.join(" "))
    .setFooter(`Announcement`)
    .setTimestamp();
  message.delete();
  message.channel.send(embed);
};
exports.help = {
  name: "announce",
  description: "Announce something",
  enabled: true,
  aliases: ["a"],
  usage: "[message]",
  category: "Misc",
};

exports.data = {
  userPermissions: ["ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [],
  botMode: 0, // same as above. Set it to 0 to require all perms to be fulfilled.
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
