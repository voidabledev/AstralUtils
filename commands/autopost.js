const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const channel = message.mentions.channels.first();
  const interval = client.millis(args[1]);
  const duration = client.millis(args[2]);
  if (interval < 0 || duration < 0)
    return message.channel.send(
      em(
        `Failure!`,
        `Please provide a valid time interval und duration!`,
        `dumbo`
      )
    );
  const msg = args.slice(3).join(" ");
  const expires = new Date().getTime() + duration;
  client
    .intervalMessage(message.channel.id, msg, interval, expires)
    .then(() => message.channel.send(em(`Success!`, `Interval set!`, `brrrr`)))
    .catch((e) => {
      console.error(e);
      message.channel.send(
        em(`Failure!`, `There was an error querying the database!`, `bruh`)
      );
    });
};
exports.help = {
  name: "autopost",
  description:
    "Posts the message in a given time interval for a set amount of time",
  enabled: true,
  aliases: ["post"],
  usage: "[channel] [interval] [duration] [message to post]",
  category: "Information",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 0, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 4,
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
