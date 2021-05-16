const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const messageID = args.shift();
  await client.giveawaysManager
    .edit(messageID, {
      addTime: 5000,
      newPrize: args.join(" "),
    })
    .then(() => {
      const numberOfSecondsMax =
        client.giveawaysManager.options.updateCountdownEvery / 1000;
      message.channel.send(
        "Success! Giveaway will updated in less than " +
          numberOfSecondsMax +
          " seconds."
      );
    })
    .catch((err) => {
      message.channel.send(
        "No giveaway found for " + messageID + ", please check and try again."
      );
    });
};
exports.help = {
  name: "gedit",
  description: "Edits an ongoing giveaway",
  enabled: true,
  aliases: ["ge"],
  usage: "[message id]",
  category: "Giveaways",
};

exports.data = {
  userPermissions: [],
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
