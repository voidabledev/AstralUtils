const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const mongo = require("../mongo");
const modSchema = require("../schemas/modschema");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const target =
    message.mentions.members.first() ||
    (await message.guild.members.fetch(args[0]));
  const makeID = client.makeID;
  const page = parseInt(args[1]) || 1;

  if (!target)
    return message.channel.send(
      em(
        `Failure!`,
        `Please specify someone to check modlogs for.`,
        `what a total noob`,
        `#7a1b07`
      )
    );

  const guildId = message.guild.id;
  const userId = target.id;

  const results = await modSchema.findOne({
    guildId,
    userId,
  });
  if (!results || !results.modlogs.length)
    return message.channel.send(
      em(
        `Modlogs for ${target.id}`,
        `No modlogs found for this user.`,
        `User ID: ${target.id}`,
        `#ff0000`
      )
    );
  const pageNum = Math.ceil(results.modlogs.length / 25);
  if (page > pageNum || page < 1)
    return message.channel.send(
      em(`Failure!`, `This page does not exist!`, `bruh`, `RED`)
    );
  let embed = new MessageEmbed()
    .setTitle(`Modlogs for ${target.user.tag}`)
    .setFooter(`User ID: ${target.id} | Page ${page}/${pageNum}`)
    .setColor("BLUE");
  const system = (input) => (input === "System" ? "System" : `<@${input}>`);
  await results.modlogs.forEach(async (log, index) => {
    if (index < (page - 1) * 25 || index > page * 25 - 1) return;
    const { author, timestamp, reason, caseID, _type } = log;
    embed.addField(
      `${_type} on ${new Date(timestamp).toLocaleDateString()}`,
      `**Moderator:** ${system(
        author
      )}\n**Reason:** ${reason}\n**Case:** ${caseID}\n\n`
    );
  });
  message.channel.send(embed);
};
exports.help = {
  name: "modlogs",
  description: "Lists all existing modlogs for a member.",
  enabled: true,
  aliases: ["mls"],
  usage: "[user mention or id]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 0,
  maxArgs: null,
  noDel: true,
};

exports.errors = {
  // edit this only if you want a custom message for this specific command.
  userPerms: null, // Else, it will default to an embed.
  botPerms: null,
  wrongUsage: null,
  disabled: null,
  other: null,
};
