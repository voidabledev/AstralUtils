const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const mongo = require("../mongo");
  const modSchema = require("../schemas/modschema");
  const warnSchema = require("../schemas/warnschema");
  const caseID = parseInt(args.shift());
  const reason = args.join(" ");
  let modlog;
  if (isNaN(caseID))
    return message.channel.send(
      em(
        `Failure!`,
        `The case ID you specified is not a number!`,
        `make sure not to confuse this with a warning ID, use the case ID instead`,
        `RED`
      )
    );
  let userId;
  await modSchema.find({ guildId: message.guild.id }, async (err, entries) => {
    if (err) throw err;
    entries.forEach(async (entry) => {
      await entry.modlogs.forEach(async (log) => {
        if (log.caseID === caseID) {
          console.log(log);
          modlog = log;
          userId = entry.userId;
          modlog.reason = reason;
          await modSchema.updateOne(
            {
              guildId: message.guild.id,
              userId,
            },
            {
              $push: {
                modlogs: modlog,
              },
            }
          );
        }
        await modSchema.updateOne(
          {
            guildId: message.guild.id,
            userId,
          },
          {
            $pull: {
              modlogs: log,
            },
          }
        );
      });
    });
  });
  if (modlog?._type === "Warn") {
    await warnSchema.find(
      { guildId: message.guild.id, userId },
      async (err, entries) => {
        if (err) console.error(err);
        if (!entries.length) return;
        const { warnings } = entries[0];
        for (let warn of warnings) {
          if (warn.caseID === modlog.caseID) {
            let newWarn = warn;
            newWarn.reason = await reason;
            await warnSchema.updateOne(
              {
                guildId: message.guild.id,
                userId,
              },
              {
                $push: {
                  warnings: newWarn,
                },
              }
            );
            await warnSchema.updateOne(
              {
                guildId: message.guild.id,
                userId,
              },
              {
                $pull: {
                  warnings: warn,
                },
              }
            );
          }
        }
      }
    );
  }
  if (modlog) {
    await message.channel.send(
      em(
        `Success!`,
        `The reason of case ${modlog.caseID} has been updated to ${modlog.reason}!`,
        `yay`,
        `GREEN`
      )
    );
    console.log(modlog);
  } else
    await message.channel.send(
      em(`Failure!`, `I couldn't find this case!`, `it does not exist`, `RED`)
    );
};
exports.help = {
  name: "reason",
  description: "Changes the reason for a warning or modlog.",
  enabled: false,
  aliases: ["r"],
  usage: "[case ID]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 0, // same as above. Set it to 0 to require all perms to be fulfilled.
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
