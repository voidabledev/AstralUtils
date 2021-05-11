const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const validTypes = [
  "PLAYING",
  "STREAMING",
  "LISTENING",
  "WATCHING",
  "COMPETING",
];

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  if (!client.config.ownerIDs.includes(message.author.id))
    return message.channel.send(
      em(
        `Failure!`,
        `You don't have permission to use this command!`,
        `this is for devs`
      )
    );
  if (args[0].toLowerCase() === "random") {
    client.randomStatus(client);
    return message.channel.send(
      em(`Success!`, `I chose a new random activity!`, `brrrrrrr`)
    );
  }
  const type = args.shift().toUpperCase();
  if (!validTypes.includes(type))
    return message.channel.send(
      em(
        `Failure!`,
        `You didn't provide a valid activity type. Choose on of the following (case insensitive):\n${validTypes.join(
          ",\n"
        )}`,
        `or just use "random" for a predfined set of activities`
      )
    );
  client.user.setPresence({ activity: { name: args.join(" "), type } });
  return message.channel.send(
    em(`Success!`, `My activity has been set!`, `puns go brrrrr`)
  );
};
exports.help = {
  name: "activity",
  description: "Sets the bot's activity.",
  enabled: true,
  aliases: [],
  usage: "[state | random] [value] ",
  category: "Development",
  hidden: true,
};

exports.data = {
  userPermissions: [],
  userMode: 0, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 0, // same as above. Set it to 0 to require all perms to be fulfilled.
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
