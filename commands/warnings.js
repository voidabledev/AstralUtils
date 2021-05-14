const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  let target = message.mentions.users.first();
  if (!target) {
    const targetMember = await message.guild.members.fetch(args[0]);
    target = targetMember.user;
  }
  const mongo = require("../mongo");
  const warnSchema = require("../schemas/warnschema");
  const makeID = client.makeID;

  if (!target)
    return message.channel.send(
      em(
        `Failure!`,
        `Please specify someone to check warnings for.`,
        `what a total noob`,
        `#7a1b07`
      )
    );

  const guildId = message.guild.id;
  const userId = target.id;

  await mongo().then(async (mongoose) => {
    try {
      const results = await warnSchema.findOne({
        guildId,
        userId,
      });
      if (!results)
        return message.channel.send(
          em(
            `Previous warnings for ${target.tag}`,
            `This user has no active warnings`,
            `User ID: ${target.id}`,
            `GREEN`
          )
        );
      let embed = em(
        `Previous warnings for ${target.username}`,
        null,
        `User ID: ${target.id}`,
        `#ff0000`
      );

      for (const warning of results.warnings) {
        const { timestamp, reason, warnID } = warning;
        const author = client.users.cache.get(message.author).username;
        embed.addField(
          `By ${author.id} on ${new Date(timestamp).toLocaleDateString()}`,
          `**Reason:** ${reason}\n**Warning ID:** \`${warnID}\`\n\n`
        );
      }

      message.channel.send(embed);
    } finally {
      mongoose.connection.close();
    }
  });
};

exports.help = {
  name: "warnings",
  description: "Displays the warnings of a member.",
  enabled: true,
  aliases: ["warns"],
  usage: "[user]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 1,
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
