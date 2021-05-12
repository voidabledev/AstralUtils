const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const mongo = require("../mongo");
const modSchema = require("../schemas/modschema");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const toCheck = parseInt(args[0], 10);
  let foundLog;
  let found;
  await mongo().then(async (mongoose) => {
    try {
      await modSchema.find({}, (err, logs) => {
        if (err) throw err;
        logs.map((log) => {
          log.modlogs.forEach((l) => {
            if (l.caseID === toCheck) {
              found = l;
              foundLog = log;
            }
          });
        });
      });
    } finally {
      mongoose.connection.close();
    }
  });
  if (!found)
    return message.channel.send(
      em(
        `Failure!`,
        `I couldn't find a modlog corresponding to that case.`,
        `duh`,
        `RED`
      )
    );
  return message.channel.send(
    em(
      `Information on Case #${found.caseID}`,
      `**User:** <@${foundLog.userId}>\n**Moderator:** ${
        found.author
      }\n **Date:** ${new Date(
        found.timestamp
      ).toLocaleDateString()}\n**Type:** ${found._type}\n**Reason:** ${
        found.reason
      }\n\n`,
      `User ID: ${foundLog.userId}`,
      `GREEN`
    )
  );
};
exports.help = {
  name: "case",
  description: "Displays a case",
  enabled: true,
  aliases: ["c"],
  usage: "[case id]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 1,
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
