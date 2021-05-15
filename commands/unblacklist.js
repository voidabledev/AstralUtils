const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModlog;
  const mongo = require("../mongo");
  const blSchema = require("../schemas/blacklistschema");
  const target =
    message.mentions.users.first() || client.users.cache.get(args[0]);
  if (!target)
    return message.channel.send(
      em(`Failure!`, `Please specify someone to blacklist!`, `idiot`, `RED`)
    );
  args.shift();
  const reason = args.join(" ") || "`No reason provided`";
  const { id } = target;
  if (!(await client.blacklisted(id)))
    return message.channel.send(
      em(`Failure!`, `This user isn't blacklisted!`, `bruh`, `RED`)
    );

  await blSchema.deleteOne({
    userId: id,
  });

  message.channel.send(
    em(`Success!`, `<@${id}> is no longer blacklisted!`, `yay`, `GREEN`)
  );
  target
    .send(
      em(
        `Unblacklist`,
        `Your blacklist from ${client.user.username} has been revoked. You can now use commands and take part in giveaways again.`,
        `yay`,
        `GREEN`
      )
    )
    .catch((e) => message.channel.send(`I was unable to notify this user.`));
  let modlog = {
    author: message.author.id,
    reason,
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "Unblacklist",
  };
  ml(id, message.guild.id, modlog, client);
};
exports.help = {
  name: "unblacklist",
  description: "Removes a bot blacklist.",
  enabled: true,
  aliases: ["unblock", "unbl"],
  usage: "[User mention or ID] [reason]",
  category: "Administration",
};

exports.data = {
  userPermissions: ["ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 0, // same as above. Set it to 0 to require all perms to be fulfilled.
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
