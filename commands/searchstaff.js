const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const mongo = require("../mongo");
  const mongoose = require("mongoose");
  const modSchema = require("../schemas/modschema");
  let pageIndex = 1;
  let target;
  try {
    target =
      message.mentions.users.first() || (await client.users.fetch(args[0]));
  } catch (e) {
    target = message.author;
    pageIndex = 0;
  }
  if (!target) {
    target = message.author;
    pageIndex = 0;
  }
  let response = [];
  let users = [];
  const page = parseInt(args[pageIndex]) || -1;

  await modSchema.find({ guildId: message.guild.id }, async (err, logs) => {
    if (err) throw err;
    await logs.forEach(async (log) => {
      await log.modlogs.forEach(async (ml) => {
        if (ml.author === target.id) {
          response.push(ml);
          users.push(log);
        }
      });
    });
  });
  if (!response.length)
    return message.channel.send(
      em(`Staff Search`, `I couldn't find any modlogs by that user!`)
    );
  const day = 1000 * 60 * 60 * 24;
  const pageNum = Math.ceil(response.length / 25);
  const system = (input) => (input === "System" ? "System" : `<@${input}>`);
  if (page === -1) {
    const embed = new MessageEmbed()
      .setTitle("Staff Search")
      .setDescription(
        `This is a summary of ${target}'s modstats. To view individual modlogs, use ${client.config.prefix}searchstaff [page].`
      )
      .setFooter(`User ID: ${target.id} | Overview`)
      .setColor("GREEN");
    const embed2 = new MessageEmbed()
      .setTitle("Staff Search (continued)")
      .setFooter(`User ID: ${target.id} | Overview`)
      .setColor("GREEN");
    const sorted = {
      Warnings: response.filter((r) => r._type === "Warn"),
      Mutes: response.filter((r) => r._type === "Mute"),
      Unmutes: response.filter((r) => r._type === "Unmute"),
      Kicks: response.filter((r) => r._type === "Kick"),
      Bans: response.filter((r) => r._type === "Ban"),
      Unbans: response.filter((r) => r._type === "Unban"),
      Subtotal: response.filter((r) =>
        ["Warn", "Mute", "Unmute", "Kick", "Ban", "Unban"].includes(r._type)
      ),
    };
    const continued = {
      Blacklists: response.filter((r) => r._type === "Blacklist"),
      Unblacklists: response.filter((r) => r._type === "Unblacklist"),
      "Nick Moderations": response.filter((r) => r._type === "Nick Moderation"),
      "Changed Nicknames": response.filter(
        (r) => r._type === "Changed Nickname"
      ),
      "Warning Removals": response.filter((r) => r.type === "Removed Warning"),
      Total: response,
    };
    for (let categ in sorted) {
      embed
        .addField(
          `${categ} \n(last 7 days)`,
          sorted[categ].filter((r) => Date.now() - r.timestamp < 7 * day)
            .length,
          true
        )
        .addField(
          `${categ} \n(last 30 days)`,
          sorted[categ].filter((r) => Date.now() - r.timestamp < 30 * day)
            .length,
          true
        )
        .addField(`${categ} \n(all time)`, sorted[categ].length, true);
    }
    for (let categ in continued) {
      embed2
        .addField(
          `${categ} \n(last 7 days)`,
          continued[categ].filter((r) => Date.now() - r.timestamp < 7 * day)
            .length,
          true
        )
        .addField(
          `${categ} \n(last 30 days)`,
          continued[categ].filter((r) => Date.now() - r.timestamp < 30 * day)
            .length,
          true
        )
        .addField(`${categ} \n(all time)`, continued[categ].length, true);
    }
    message.channel.send(embed);
    message.channel.send(embed2);
    return;
  }
  if (page > pageNum || page < 1)
    return message.channel.send(
      em(`Failure!`, `This page does not exist!`, `bruh`, `RED`)
    );
  let embed = new MessageEmbed()
    .setTitle(`Staff Search`)
    .setFooter(`User ID: ${target.id} | Page ${page}/${pageNum}`)
    .setColor("BLUE");
  response.forEach(async (r, index) => {
    if (index < (page - 1) * 25 || index > page * 25 - 1) return;
    embed.addField(
      `${r._type} on ${new Date(r.timestamp).toLocaleDateString()}`,
      `**User:** ${system(users[index].userId)} \n**Reason:** ${
        r.reason
      }\n**Case:** ${r.caseID}\n\n`
    );
  });
  message.channel.send(embed);
};
exports.help = {
  name: "searchstaff",
  description: "Searches the punishments a staff has made",
  enabled: true,
  aliases: ["ss", "modstats"],
  usage: "[mention or user id]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 0,
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
