const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModlog;
  const guild = message.guild;
  let search = args[0];

  if (!search)
    return message.channel.send(
      em(
        `Failure!`,
        `Please provide a valid user ID`,
        `lmao you can't put a user id?`,
        `#7a1b07`
      )
    );

  try {
    let bans = await message.guild.fetchBans();
    const banned = await bans.find((b) => b.user.id === search);

    if (!banned)
      return message.channel.send(
        em(
          `Failure!`,
          `The user is not banned.`,
          `provide a valid user dum dum`,
          `#7a1b07`
        )
      );

    await guild.members.unban(banned.user);

    message.channel.send(
      em(
        `Success!`,
        `${banned.user} has been unbanned!`,
        `unban go brrrrr`,
        `#00ff66`
      )
    );
  } catch (e) {
    return message.channel.send(
      em(
        `Failure!`,
        `Unban failed. Error: ${e.message}`,
        `Please report this bug to the devs.`,
        `##7a1b07`
      )
    );
  }
  const userId = search;
  const guildId = message.guild.id;
  let reason = "";
  if (!args[1]) reason = "`No reason provided`";
  else reason = `\`${args.slice(1).join(" ")}\``;
  let modlog = {
    author: message.author.id,
    reason,
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "Unbanned a member",
  };
  ml(userId, guildId, modlog, client);
};

exports.help = {
  name: "unban",
  description: "Unbans a banned member.",
  enabled: true,
  aliases: ["unb"],
  usage: "[user id]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: ["BAN_MEMBERS"], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 0,
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
