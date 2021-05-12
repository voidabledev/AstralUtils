const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config.json");
const mongo = require("../mongo");
const punishSchema = require("../schemas/punishschema");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModlog;
  await message.guild.roles.fetch();
  const member =
    message.mentions.members.first() ||
    message.guild.members.cache.find(args[0]);
  const role = message.guild.roles.cache.find(
    (r) => r.name.toLowerCase() === "muted"
  );
  let reason = "";

  if (!role)
    return message.channel.send(
      em(
        `Failure!`,
        `There is no \`Muted\` role. Please run \`${prefix}mute\` to generate one!`,
        `bruh`,
        `#7a1b07`
      )
    );
  if (!member)
    return message.channel.send(
      em(
        `Failure!`,
        `You didn't provide a user. Please mention one or enter a valid user ID.`,
        `don't message devs kthx`,
        `#7a1b07`
      )
    );
  if (!args[1]) reason = "`No reason provided`";
  else reason = `\`${args.slice(1).join(" ")}\``;
  if (!member.roles.cache.find((r) => r.name.toLowerCase() === "muted"))
    return message.channel.send(
      em(
        `Failure!`,
        `User is not muted!`,
        `doesn't know how to use mod cmds...`,
        `#7a1b07`
      )
    );

  member.roles.remove(role);
  message.channel.send(
    em(`Success!`, `${member} has now been unmuted for ${reason}!`, `lol`)
  );
  const userId = member.id;
  const guildId = message.guild.id;
  let modlog = {
    author: message.author.id,
    reason,
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "Unmuted a member",
  };
  ml(userId, guildId, modlog, client);
  const mongo = require("../mongo");
  const muteSchema = require("../schemas/muteschema");
  const punishSchema = require("../schemas/punishschema");
  await mongo().then(async (mongoose) => {
    try {
      await punishSchema.deleteOne({
        userId,
        guildId,
      });
      await muteSchema.deleteOne({
        userId,
        guildId,
      });
    } finally {
      mongoose.connection.close();
    }
  });
};

exports.help = {
  name: "unmute",
  description: "Unmutes a muted member.",
  enabled: true,
  aliases: ["unm"],
  usage: "[member] [reason]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_ROLES", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: ["MANAGE_ROLES"], // if no permissions are required, leave the array empty and set the Mode to 0
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
