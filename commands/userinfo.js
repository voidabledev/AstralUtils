const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const member =
    message.mentions.members.last() ||
    message.guild.members.cache.get(args[0]) ||
    message.member;

  const trimArray = (arr, maxLen = 10) => {
    if (arr.length > maxLen) {
      const len = arr.length - maxLen;
      arr = arr.slice(0, maxLen);
      arr.push(` and ${len} more roles...`);
    }
    return arr;
  };

  const upperCase = (str) => {
    return str.toUpperCase().replace(/_/g, " ").split(" ").join(" ");
  };

  const titleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(" ");
  };

  const roles = member.roles.cache
    .sort((a, b) => b.position - a.position)
    .map((role) => role.toString())
    .slice(0, -1);

  let userFlags;
  if (member.user.flags === null) {
    userFlags = "";
  } else {
    userFlags = member.user.flags.toArray();
  }
  if (member.user.presence.status == "offline") {
    userDevice = "";
  } else if (!member.user.bot) {
    userDevice = [Object.keys(member.user.presence.clientStatus)[0]];
  } else if (member.user.bot) {
    userDevice = "";
  }
  if (!member.user.bot) {
    userInfo = "No";
  } else if (member.user.bot) {
    userInfo = "Yes";
  }
  if (member.user.presence.status == "dnd") {
    status = "DND";
  } else status = titleCase(member.user.presence.status);

  const embed = new MessageEmbed()
    .setAuthor(
      `${member.user.tag} ${userDevice}`,
      member.user.displayAvatarURL({ dynamic: true, size: 512 })
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
    .addFields(
      {
        name: "Joined Discord",
        value: `${moment(member.user.createdTimestamp).format("DD MMM YYYY")}`,
        inline: true,
      },
      {
        name: "Joined Server",
        value: `${moment(member.joinedAt).format("DD MMM YYYY")}`,
        inline: true,
      },
      {
        name: "Nickname",
        value: `${member.displayName}` || "None",
        inline: true,
      },
      {
        name: "Discriminator",
        value: `${member.user.discriminator}`,
        inline: true,
      },
      { name: "Bot", value: `${userInfo}`, inline: true },
      {
        name: "User Colour",
        value: `${upperCase(member.displayHexColor)}`,
        inline: true,
      },
      { name: "User ID", value: `${member.user.id}`, inline: true },
      {
        name: "Highest Role",
        value: `${
          member.roles.highest.id === message.guild.id
            ? "None"
            : member.roles.highest
        }`,
        inline: true,
      },
      {
        name: "Roles",
        value: `${
          roles.length < 10
            ? roles.join(", ")
            : roles.length > 10
            ? trimArray(roles).join(", ")
            : "None"
        }`,
        inline: false,
      }
    )
    .setColor(`${member.displayHexColor || RANDOM}`);
  message.channel.send(embed);
};

exports.help = {
  name: "userinfo",
  description: "Displays information about a user",
  enabled: true,
  aliases: ["ui"],
  usage: "[user]",
  category: "Misc",
};

exports.data = {
  userPermissions: [],
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
