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
        `I couldn't find this user!``Please provide a valid mention or user ID`, // going to fix mute brb
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
        `This user has a top role, I can't demote them!`,
        `smfh`,
        `ORANGE`
      )
    );
  let newRole;
  let rmRole;
  if (getPos(staffRoles[0]) > member.roles.highest.position)
    // if the member isn't staff, we can't demote them
    return message.channel.send(
      em(
        `Failure!`,
        `They aren't staff, they can't be demoted...`,
        `dummy`,
        `RED`
      )
    );
  staffRoles.forEach((pos, index, sr) => {
    // else we loop over the staff roles and check which is their highest role
    if (pos === member.roles.highest.id) {
      rmRole = message.guild.roles.cache.get(pos); // we remove this role
      if (index !== 1)
        newRole = message.guild.roles.cache.get(staffRoles[index - 1]);
      else newRole = null; // and we add the previous one, or none if they are tmod
    }
  });
  let additionalRoles = [];
  if (newRole === null) {
    additionalRoles.push(staffRoles[0]);
  }
  if (newRole?.id === staffRoles[4]) additionalRoles.push("831996399209414697");
  let posName;
  if (newRole === null) posName = "Member";
  else posName = newRole?.name?.replace("Perms", "");
  await message.channel.send(
    em(
      `Attention!`,
      `Are you sure you want to demote <@${member.id}> to ${posName}?`,
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
      if (mc.first().content.toLowerCase() !== "yes") throw "no demotion";
      member.roles.remove(rmRole);
      if (!message.member.roles.cache.get(newRole.id))
        member.roles.add(newRole);
      if (additionalRoles.length)
        additionalRoles.forEach((r) => {
          if (member.roles.cache.get(r)) member.roles.remove(r);
        });
      message.channel.send(
        em(
          `Success!`,
          `${member} has been demoted to ${newRole.name.replace("Perms", "")}`,
          `sad`,
          `GREEN`
        )
      );
    })
    .catch((e) => {
      message.channel.send(`Demotion cancelled.`);
      console.error(e);
    });
};
exports.help = {
  name: "demote",
  description: "Demotes a staff member",
  enabled: true,
  aliases: ["d"],
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
