const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  let number = args.shift(" ");

  if (number === "1")
    message.channel.send(
      em(
        `Respect`,
        `Treat everyone in the server with respect, both the staff and the members.\nTreat everybody how you would want to be treated.`
      )
    );
};
exports.help = {
  name: "rule",
  description: "Displays a rule",
  enabled: false,
  aliases: [],
  usage: "[number]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 0,
  maxArgs: null,
  noDel: true, // change this to true if the command belongs to the "Moderation" category
}; // and you don't want to og message to be deleted.

exports.errors = {
  // edit this only if you want a custom message for this specific command.
  userPerms: null, // Else, it will default to an embed.
  botPerms: null,
  wrongUsage: null,
  disabled: null,
  other: null,
};
