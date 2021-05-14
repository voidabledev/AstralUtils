const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const mongo = require("../mongo");
  const blSchema = require("../schemas/blacklistschema");
  const target =
    message.mentions.users.first() || client.users.cache.get(args[0]);
  if (!target)
    return message.channel.send(
      em(`Failure!`, `Please specify someone to blacklist!`, `idiot`, `RED`)
    );
  args.shift();
  const reason = args.join(" ");
  const { id } = target;
  if (client.blacklisted(id))
    return message.channel.send(
      em(`Failure!`, `This user is already blacklisted!`, `bruh`, `RED`)
    );
  if (client.config.ownerIDs.includes(id))
    return message.channel.send(
      em(
        `Failure!`,
        `You can't blacklist that person!`,
        `they are too cool to be blocked`,
        `RED`
      )
    );
  await mongo().then(async (mongoose) => {
    try {
      blSchema.create({
        userId: id,
        reason,
      });
    } finally {
      mongoose.connection.close();
      message.channel.send(
        em(`Success!`, `<@${id}> has been blacklisted!`, `yay`, `GREEN`)
      );
    }
  });
  let modlog = {
    author: message.author.id,
    reason,
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "Blacklisted a member",
  };
  ml(id, message.guild.id, modlog, client);
};
exports.help = {
  name: "blacklist",
  description: "Blacklists a user from using the bot.",
  enabled: true,
  aliases: ["block", "bl"],
  usage: "[User mention or ID] [reason]",
  category: "Administration",
};

exports.data = {
  userPermissions: ["ADMINISTRATOR"],
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
