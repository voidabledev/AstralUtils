const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModlog;

  const targetUser =
    message.mentions.users.first() || (await client.users.fetch(args[0]));
  if (!targetUser) {
    return message.channel.send(
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
    guild.roles.cache.find(
      (role) =>
        role.name.toLowerCase() === roleName.toLowerCase() ||
        (role.name.startsWith("• ") && role.name.slice(2) === roleName)
    ) || guild.roles.cache.get(roleName);
  if (!role) {
    return message.channel.send(
      em(`Failure!`, `There is no role with that name.`, `duh`, `RED`)
    );
  }
  if (role.position >= message.member.roles.highest.position)
    return message.channel.send(
      em(
        `Failure!`,
        `You can't give out roles higher than or equal to your highest rank!`,
        `duh`,
        `RED`
      )
    );
  if (role.position >= message.guild.me.roles.highest.position)
    return message.channel.send(
      em(`Failure!`, `I can't manage this role!`, `eh`, `RED`)
    );
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
    let modlog = {
      author: message.author.id,
      reason: "No reason provided.",
      caseID: 0,
      timestamp: new Date().getTime(),
      _type: "Add Role",
    };
    await ml(targetUser.id, message.guild.id, modlog, client);
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
    let modlog = {
      author: message.author.id,
      reason: "`No reason provided.`",
      caseID: 0,
      timestamp: new Date().getTime(),
      _type: "Removed Role",
    };
    ml(targetUser.id, message.guild.id, modlog, client);
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
};
exports.help = {
  name: "role",
  description: "Adds/Removes a role to a user",
  enabled: true,
  aliases: [],
  usage: "[user mention or id] [add/rm] [role name or id]", // yes start the dev bot
  category: "Moderation", // done
};

exports.data = {
  userPermissions: ["MANAGE_ROLES", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: ["MANAGE_ROLES", "ADMINISTRATOR"], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 3,
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
