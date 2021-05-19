const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const limit = client.giveawaysManager.limitPerDay;
  const withinaday = client.giveawaysManager.giveaways.filter(
    (g) => new Date().getTime() - g.startAt < 1000 * 60 * 60 * 24
  );
  const starts = withinaday.map((gw) => gw.startAt);
  const nextToExpire = Math.min(...starts);
  const embed = new MessageEmbed().setTitle(
    `${withinaday.length} giveaways in the last day`
  );
  if (withinaday.length < limit) {
    embed
      .setColor("GREEN")
      .setDescription(
        `${limit - withinaday.length} more giveaways can be hosted.`
      )
      .setFooter("Another one will be available at")
      .setTimestamp(nextToExpire + 1000 * 60 * 60 * 24);
  } else {
    embed
      .setColor("RED")
      .setDescription("Currently, no more giveaways can be hosted.")
      .setFooter("One will be available to host at")
      .setTimestamp(nextToExpire + 1000 * 60 * 60 * 24);
  }
  return message.channel.send(embed);
};
exports.help = {
  name: "glimit",
  description:
    "Gets the amount of giveaways that have been hosted within 24 hours and when the next one can be hosted.",
  enabled: true,
  aliases: [],
  usage: "",
  category: "Giveaways",
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
