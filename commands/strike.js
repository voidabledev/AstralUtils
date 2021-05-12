const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const strikeId = client.makeID(32, 8);
  let target;
  try {
    target =
      message.mentions.users.first() || (await client.users.fetch(args[0]));
  } catch (e) {
    return message.channel.send(
      `Failure!`,
      `You have to specify someone to strike!`
    );
  }
  if (!target)
    return message.channel.send(
      em(`Failure!`, `You have to specify someone to strike!`)
    );
  let reason = `\`${args.slice(1).join(" ")}\``;
  if (reason.length < 2)
    return message.channel.send(
      em(
        `Failure!`,
        `You've to specify a reason! You can't strike without a reason.`
      )
    );
  const { id } = target;
  if (id === message.author.id) {
    return message.channel.send(
      em(
        `Failure!`,
        `You're a silly Admin you know? You can't strike yourself.`
      )
    );
  }
  if (
    message.member.roles.highest.position <
    message.guild.members.cache.get(target.id).roles.highest.position
  )
    return message.channel.send(
      em(
        `Failure!`,
        `Who are you trying to strike, the owner? You can't strike people above you!`
      )
    );
  const embed = new MessageEmbed()
    .setTitle(`Striked`)
    .setDescription(
      `You have been striked by ${message.author} for ${reason} with ID \`${strikeId}\``
    )
    .setFooter(
      `If you think this is a mistake, please DM the Admin who striked you`
    );
  target.send(embed);
  const logEmbed = new MessageEmbed()
    .setTitle(`Striked`)
    .setDescription(
      `${target} has been striked by ${message.author} for ${reason} with ID \`${strikeId}\``
    )
    .setFooter(`User ID: ${id}`);
  message.guild.channels.cache.get("831996554763829338").send(logEmbed);
};
exports.help = {
  name: "strike",
  description: "Strikes a staff member.",
  enabled: true,
  aliases: ["s"],
  usage: "[user] [reason]",
  category: "Moderation",
  hidden: true,
};

exports.data = {
  userPermissions: ["ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 2,
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
