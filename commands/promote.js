const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const member =
    message.mentions.members.first() ||
    (await message.guild.members.fetch(args[0]));
  if (!member)
    return message.channel.send(
      em(
        `Failure!`,
        `I couldn't find this user!``Please provide a valid mention or user ID`,
        `RED`
      )
    );
  const pos = member.roles.highest.position;
  const staffRoles = [
    "831996404549419018", // base staff
    "831996402619777045", // tmod
    "831996401872535573", // mod
    "831996400782016563", // hmod
    "836295798852550686", // admin (perms)
    "836583124283686943", // manager
  ]; //admin 831996399209414697
  const getPos = (id) => {
    return message.guild.roles.cache.get(id).position;
  };
  if (member.roles.highest.position > getPos(staffRoles[5]))
    return message.channel.send(
      em(
        `Failure!`,
        `This user has a top role, I can't promote them any further!`,
        `smfh`,
        `ORANGE`
      )
    );
  let newRole;
  if (getPos(staffRoles[0]) > member.roles.highest.position)
    // if the member isn't already staff
    newRole = message.guild.roles.cache.get(staffRoles[1]);
  // the new role is tmod
  else {
    staffRoles.forEach((pos, index, sr) => {
      // else we loop over the staff roles and check which is their highest role
      if (pos === member.roles.highest.id)
        newRole = message.guild.roles.cache.get(staffRoles[index + 1]); // the one over that one is now our role that we want
    }); // now we know what role to promote to
  }
  let additionalRoles = [];
  if (!member.roles.cache.get(staffRoles[0]))
    additionalRoles.push(staffRoles[0]);
  if (newRole.id === staffRoles[4]) additionalRoles.push("831996399209414697");
  await message.channel.send(
    em(
      `Attention!`,
      `Are you sure you want to promote <@${
        member.id
      }> to ${newRole.name.replace("Perms", "")}?`,
      `Say yes or no`
    )
  );
  message.channel
    .awaitMessages((m) => m.author.id === message.author.id, {
      max: 1,
      time: 60000,
      errors: ["time"],
    })
    .then((mc) => {
      const m = mc.first();
      if (m.content.toLowerCase() !== "yes") throw "no promotion";
      member.roles.add(newRole);
      if (additionalRoles.length)
        additionalRoles.forEach((r) => member.roles.add(r));
      message.channel.send(
        em(
          `Success!`,
          `${member} has been promoted to ${newRole.name.replace("Perms", "")}`,
          `yay`,
          `GREEN`
        )
      );
    })
    .catch((e) => {
      message.channel.send(`Promotion cancelled!`);
      console.error(e);
    });
};
exports.help = {
  name: "promote",
  description: "Promotes a staff member",
  enabled: true,
  aliases: ["p"],
  usage: "[user]",
  category: "Administration",
};

exports.data = {
  userPermissions: ["ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
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
