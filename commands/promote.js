const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

(exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const targetUser = message.mentions.users.first();
  if (!targetUser) {
    message.channel.send(
      em(`Failure!`, `Please specify who to give the role to.`)
    );
  }

  arguments.shift();

  const roleName = arguments.join(" ");
  const { guild } = message;

  const role = guild.roles.cache.find((role) => {
    return role.name === roleName;
  });
  if (!role) {
    message.channel.send(
      em(`Failure!`, `There is no role with that name.`, `duh`, `RED`)
    );
    return;
  }

  const member = guild.members.cache.get(targetUser.id);
  member.roles.add(role);

  message.channel.send(
    em(`Success!`, `That user has now the ${roleName} role`, `yay`, `GREEN`)
  );
}),
  (exports.help = {
    name: "addrole",
    description: "Adds a role to a user",
    enabled: true,
    aliases: ["p"],
    usage: "[user] [role]",
    category: "Moderation",
  });

exports.data = {
  userPermissions: ["BAN_MEMBERS"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 0,
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
