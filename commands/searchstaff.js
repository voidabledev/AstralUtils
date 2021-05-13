const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const mongo = require("../mongo");
  const mongoose = require("mongoose");
  const modSchema = require("../schemas/modschema");
  let target;
  try {
    target =
      message.mentions.users.first() || (await client.users.get(args[0]));
  } catch (e) {
    return message.channel.send(em(`Failure!`, `You must specify a user!`));
  }
  if (!target)
    return message.channel.send(em(`Failure!`, `You need to specify a user!`));
  let response = [];
  let users = [];
  await mongo().then(async (mongoose) => {
    try {
      await modSchema.find({}, (err, logs) => {
        if (err) throw err;
        logs.forEach(async (log) => {
          await log.modlogs.forEach(async (ml) => {
            if (ml.author === target.id) {
              response.push(ml);
              users.push(log);
            }
          });
        });
      });
    } finally {
      mongoose.connection.close();
    }
  });
  if (!response.length)
    return message.channel.send(
      em(`Staff Search`, `I couldn't find any modlogs by that user!`)
    );
  let embed = new MessageEmbed()
    .setTitle(`Staff Search`)
    .setDescription(
      `I found a total of ${response.length} modlogs by this user!`
    );
  response.forEach(async (r, index) => {
    embed.addField(
      `${r._type} on ${new Date(r.timestamp).toLocaleDateString()}`,
      `**User:** <@${users[index].userId}> \n**Reason:** ${r.reason}\n**Case:** ${r.caseID}\n\n`
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
