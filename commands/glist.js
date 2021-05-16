const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const allGiveaways = await client.giveawaysManager.giveaways;
  const onServer = allGiveaways.filter(
    (g) => g.guildID === "831995980097388604"
  );
  const notEnded = onServer.filter((g) => !g.ended);
  if (!notEnded.length)
    return message.channel.send(
      em(`Active giveaways`, `There are no active giveaways!`, `sad`, `YELLOW`)
    );
  let embed = new MessageEmbed()
    .setTitle(`Active giveaways`)
    .setFooter(`wooooo`)
    .setColor(`GREEN`);
  for (const entry of notEnded) {
    embed.addField(
      entry.prize,
      `**Hosted by:** <@${entry.hostedBy}>\n**Channel:** <#${
        entry.channelID
      }>\n**Ends on:** ${new Date().setTime(entry.endAt)}\n**Winners:** ${
        entry.winnerCount
      }\n\n_ _`
    );
  }
  message.channel.send(embed);
};
exports.help = {
  name: "glist",
  description: "Lists all the active giveaways",
  enabled: true,
  aliases: ["gl"],
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
