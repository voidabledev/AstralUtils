const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const target =
    message.mentions.members.first() ||
    (await message.guild.members.fetch(args[0]));
  let nick = "";
  let id = target.id;
  if (id === message.author.id)
    return message.channel.send(
      em(`Failure!`, `You can't edit your nickname, dummy!`)
    );
  if (!target.manageable)
    return message.channel.send(
      em(`Failure!`, `I can't edit that user's nickname.`)
    );
  target.setNickname(nick);
  message.channel.send(
    em(
      `Success!`,
      `<a:yes:836302807485251674> Set ${target}'s nickname to ${nick}`
    )
  );
};

exports.help = {
  name: "nick",
  description: "Changes the nickname of a user.",
  enabled: true,
  aliases: ["n"],
  usage: "[user] [nickname]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_NICKNAMES"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
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
