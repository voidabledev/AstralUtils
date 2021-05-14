const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config.json");
const mongo = require("../mongo");
const punishSchema = require("../schemas/punishschema");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModlog;
  const member =
    message.mentions.members.first() ||
    (await message.guild.members.fetch(args[0]));
  const role = message.guild.roles.cache.find(
    (r) => r.name.toLowerCase() === "muted"
  );
  let reason = "";
  if (!args[1]) reason = "`No reason provided`";
  else reason = `\`${args.slice(1).join(" ")}\``;
  if (!member.roles.cache.find((r) => r.name.toLowerCase() === "muted"))
    message.channel.send(em(`Failure!`, `The user is not muted.`));

  member.roles.remove(role);
  message.channel.send(
    em(`Failure!`, `${user} has been unmuted for ${reason}`),
    `yay`,
    `GREEN`
  );
  const userId = member.id;
  const guildId = message.guild.id;
  let modlog = {
    author: message.author.id,
    reason,
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "Unmute",
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
  const embed = new MessageEmbed()
    .setDescription(
      `You have been unmuted in **${message.guild.name}** for \`${reason}\``
    )
    .setColor("RED");
  try {
    await member.user.send(embed);
  } catch {
    message.channel.send(
      `I was unable to notify this user. The action has been logged.`
    );
  }
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
  userPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: ["MANAGE_ROLES"], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 2,
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
