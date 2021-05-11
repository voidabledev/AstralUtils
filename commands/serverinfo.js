const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  await message.guild.members.fetch();
  let embed = new Discord.MessageEmbed()
    .setTimestamp()
    .setTitle("**Server Information**")
    .setColor("RANDOM")
    .setThumbnail(message.guild.iconURL({ dynamic: true }))
    .addField(`🎫 Name of server:`, message.guild.name, true)
    .addField(`👑 Owner of server`, message.guild.owner, true)
    .addField(`🆔 ID of server`, message.guild.id, true)
    .addField(
      `👥 Member total:`,
      `${message.guild.members.cache.size}\n\n`,
      true
    )
    .addField(
      `🤖 Bots:`,
      message.guild.members.cache.filter((member) => member.user.bot).size,
      true
    )
    .addField(
      `🚶 Weights:`,
      message.guild.members.cache.filter((member) => !member.user.bot).size,
      true
    )
    .addField(`🗺 Region of server`, message.guild.region, true)
    .addField(`😗 Emojis:`, message.guild.emojis.cache.size, true)
    .addField(
      `👻 Animated Emoji\'s:`,
      message.guild.emojis.cache.filter((emoji) => emoji.animated).size,
      true
    )
    .addField(
      `💬 Total Text Channels:`,
      message.guild.channels.cache.filter((channel) => channel.type === "text")
        .size,
      true
    )
    .addField(
      `🎤 Total Voice Channels:`,
      message.guild.channels.cache.filter((channel) => channel.type === "voice")
        .size,
      true
    )
    .addField(`👔 Total Amount of Roles:`, message.guild.roles.cache.size, true)
    .setAuthor(
      message.author.username,
      message.author.displayAvatarURL({ format: "png" })
    );
  message.channel.send(embed);
};
exports.help = {
  name: "serverinfo",
  description: "Displays server info",
  enabled: true,
  aliases: ["sinfo"],
  usage: "",
  category: "Information",
};

exports.data = {
  userPermissions: [],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 0,
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
