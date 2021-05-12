const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

(exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const targetUser = message.mentions.users.first();
  if (!targetUser) {
    message.channel.send(
      em(
        `Failure!`,
        `Please specify who to give the role to.`,
        `bruh moment`,
        `RED`
      )
    );
  }

  args.shift();
  const mode = args.shift();
  const roleName = args.join(" ");
  const { guild } = message;
  let role =
    guild.roles.cache.find((role) => role.name.toLowerCase() === roleName) ||
    guild.roles.cache.get(roleName);
  if (!role) {
    message.channel.send(
      em(`Failure!`, `There is no role with that name.`, `duh`, `RED`)
    );
    return;
  }

  const member = guild.members.cache.get(targetUser.id);
  if (["+", "add", "give"].includes(mode)) {
    if (member.roles.cache.get(role.id))
      return message.channel.send(
        em(
          `Failure!`,
          `${member} already has the ${role.name} role!`,
          `duh`,
          `RED`
        )
      );
    member.roles.add(role);
    return message.channel.send(
      em(`Success!`, `${member} now has the ${role.name} role`, `yay`, `GREEN`)
    );
  }
  if (["-", "remove", "rm", "take"].includes(mode)) {
    if (!member.roles.cache.get(role.id))
      return message.channel.send(
        em(
          `Failure!`,
          `${member} doesn't have the ${role.name} role!`,
          `duh`,
          `RED`
        )
      );
    member.roles.remove(role);
    return message.channel.send(
      em(
        `Success!`,
        `${member} now no longer has the ${role.name} role`,
        `sad`,
        `GREEN`
      )
    );
  }
  return message.channel.send(
    em(
      `Failure!`,
      `Please tell me if I should give or take the role!\nValid keywords are: \`${[
        "+",
        "add",
        "give",
      ].join(", ")}\` for adding a role and \`${[
        "-",
        "remove",
        "rm",
        "take",
      ].join(", ")}\``,
      `lol what a noob`,
      `RED`
    )
  );
}),
  (exports.help = {
    name: "role",
    description: "Adds/Removes a role to a user",
    enabled: true,
    aliases: [],
    usage: "[user mention or id] [add/rem] [role mention or id]",
    category: "Moderation",
  });

exports.data = {
  userPermissions: ["MANAGE_ROLES"],
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
