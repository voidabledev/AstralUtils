const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const mongo = require("../mongo");
const warnSchema = require("../schemas/warnschema");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const punishid = args.shift();
  const ml = client.setModlog;
  const reason = args.join(" ");

  if (!punishid) {
    const m = await message.channel.send(
      em(`Failure!`, `Please give a valid warning ID!`)
    );
    m.delete({ timeout: 10000 });
    message.delete({ timeout: 10000 });
  }

  const guildId = message.guild.id;
  let success = false;

  await warnSchema.find({ guildId }, async (err, entries) => {
    if (err) throw err;
    outer: for (let entry of entries) {
      for (let warn of entry.warnings) {
        if (warn.warnID === punishid) {
          await warnSchema.findOneAndUpdate(
            {
              userId: entry.userId,
              guildId: message.guild.id,
            },
            {
              $pull: {
                warnings: warn,
              },
            }
          );
          message.channel.send(
            em(
              `Success!`,
              `Deleted the warning ID \`${punishid}\`.`,
              `yay`,
              `GREEN`
            )
          );
          let modlog = {
            author: message.author.id,
            reason,
            caseID: 0,
            timestamp: new Date().getTime(),
            _type: "Removed Warning",
          };
          ml(entry.userId, guildId, modlog, client);
          success = true;
          break outer;
        }
      }
    }
    if (!success)
      return message.channel.send(
        em(`Failure!`, `I couldn't find a warning with this ID.`, `duh`, `RED`)
      );
  });
};
exports.help = {
  name: "rmwarn",
  description: "Removes a warn from the user.",
  enabled: true,
  aliases: ["rmpunish"],
  usage: "[warn id] [reason]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 0,
  maxArgs: null,
  noDel: true, // change this to true if the command belongs to the "Moderation" category
}; // and you don't want to og message to be deleted.

exports.errors = {
  // edit this only if you want a custom message for this specific command.
  userPerms: null, // Else, it will default to an embed.
  botPerms: null,
  wrongUsage: null,
  disabled: null,
  other: null,
};
