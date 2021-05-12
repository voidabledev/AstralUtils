const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const mongo = require("../mongo");
const modSchema = require("../schemas/modschema");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const target = message.mentions.users.first();
  const makeID = client.makeID;

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

  await mongo().then(async (mongoose) => {
    try {
      const results = await modSchema.findOne({
        guildId,
        userId,
      });
      let embed = em(
        `Modlogs for ${target.tag}`,
        null,
        `User ID: ${target.id}`,
        `#ff0000`
      );
      for (const log of results.modlogs) {
        const { author, timestamp, reason, caseID, _type } = log;
        embed.addField(
          `By ${author} on ${new Date(timestamp).toLocaleDateString()}`,
          `**Type:** ${_type}\n**Reason:** ${reason}\n**Case:** ${caseID}\n\n`
        );
      }

      message.channel.send(embed);
    } finally {
      mongoose.connection.close();
    }
  });
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
  userPermissions: ["MANAGE_ROLES", "ADMINISTRATOR"],
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
