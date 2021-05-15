const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  if (
    !message.member.hasPermission("MANAGE_MESSAGES") &&
    !message.member.roles.cache.some((r) => r.name === "Giveaways") // lemme look up how the message links work
  ) {
    return message.channel.send(
      "You need to have the manage messages permissions or the 'Giveaways' role to reroll giveaways."
    );
  }

  if (!args[0]) {
    return message.channel.send("You have to specify a valid message ID!");
  }

  let giveaway =
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(" ")) ||
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

  if (!giveaway) {
    return message.channel.send(
      "Unable to find a giveaway for `" + args.join(" ") + "`."
    );
  }

  client.giveawaysManager.reroll(giveaway.messageID).catch((e) => {
    if (
      e.startsWith(
        `Giveaway with message ID ${giveaway.messageID} is not ended.`
      )
    ) {
      message.channel.send("This giveaway is not ended!");
    } else {
      console.error(e);
      message.channel.send("An error occured...");
    }
  });
};
exports.help = {
  name: "gereroll",
  description: "Rerolls a giveaway",
  enabled: true,
  aliases: ["gr"],
  usage: "[message id]",
  category: "Giveaways",
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
