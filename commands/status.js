const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const valid = ["online", "idle", "dnd", "invisible"];
  if (!client.config.ownerIDs.includes(message.author.id))
    return message.channel.send(
      em(
        `Failure!`,
        `You don't have permission to use this command!`,
        `this is for devs`
      )
    );
  if (!valid.includes(args[0].toLowerCase()))
    return message.channel.send(
      em(
        `Failure!`,
        `That's not a valid status type! Choose from the following (case insensitive):\n${valid.join(
          ",\n"
        )}`,
        `bruh`
      )
    );
  client.user.setStatus(args[0].toLowerCase());
  return message.channel.send(em(`Success!`, `I changed my status!`, `brrrr`));
};
exports.help = {
  name: "status",
  description: "[status]",
  enabled: true,
  aliases: [],
  usage: "",
  category: "",
  hidden: true,
};

exports.data = {
  userPermissions: [],
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
