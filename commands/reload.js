const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const { ownerIDs } = require("../config.json");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  if (!ownerIDs.includes(message.author.id))
    return message.channel.send(
      em(
        `Failure!`,
        `You are not permitted to use this command!`,
        `This is a dev tool and only devs can use it.`
      )
    );
  const cmdName = args[0];
  const command =
    client.commands.get(cmdName) ||
    client.commands.find(
      (c) => c.help.aliases && c.help.aliases.includes(cmdName)
    );
  if (!command)
    return message.channel.send(
      em(
        `Failure!`,
        `I couldn't find a command with name of alias \`${cmdName}\`!`,
        `bruh`
      )
    );
  delete require.cache[require.resolve(`./${command.help.name}.js`)];
  try {
    const newCommand = require(`./${command.help.name}.js`);
    client.commands.set(newCommand.help.name, newCommand);
    console.log(`Reloaded ${newCommand.help.name}`);
    return message.channel.send(
      em(
        `Success!`,
        `Command \`${newCommand.help.name}\` has successfully been reloaded!`,
        `less restarting, isn't that nice?`
      )
    );
  } catch (e) {
    console.error(e);
    return message.channel.send(
      em(`Failure!`, `I couldn't reload that command!`, `get good noob`)
    );
  }
};
exports.help = {
  name: "reload",
  description: "Reloads a specified command.",
  enabled: true,
  aliases: ["rl"],
  usage: "[command name]",
  category: "",
  hidden: true,
};

exports.data = {
  userPermissions: [],
  userMode: 0, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 0, // same as above. Set it to 0 to require all perms to be fulfilled.
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
