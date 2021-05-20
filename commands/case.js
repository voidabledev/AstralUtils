const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const modSchema = require("../schemas/modschema");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const toCheck = parseInt(args[0], 10);
  new Promise(async (resolve) => {
    let foundLog;
    let found;
    await modSchema.find({}, (err, logs) => {
      if (err) console.error(err);
      foundLog = logs.find((log) => {
        let ml = log.modlogs.find((l) => l.caseID === toCheck);
        if (ml) found = ml;
        return !!ml;
      });
      resolve({
        found,
        foundLog,
      });
    });
  }).then((res) => {
    const { found, foundLog } = res;
    if (!found)
      return message.channel.send(
        em(
          `Failure!`,
          `I couldn't find a modlog corresponding to that case.`,
          `duh`,
          `RED`
        )
      );
    const embed = new MessageEmbed()
      .setTitle(`Case #${found.caseID}`)
      .addField("Punishment Type", found._type)
      .addField(
        "Moderator",
        `${found.author === "System" ? "" : "<@"}${found.author}${
          found.author === "System" ? "" : ">"
        } ${found.author === "System" ? "" : `(${found.author})`}`
      )
      .addField("User", `<@${foundLog.userId}> (${foundLog.userId})`)
      .addField("Reason", found.reason)
      .setFooter("Created")
      .setTimestamp(found.timestamp)
      .setColor("RANDOM");
    return message.channel.send(embed);
  });
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
