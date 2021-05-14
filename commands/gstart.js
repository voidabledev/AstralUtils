const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  if (
    !message.member.hasPermission("MANAGE_MESSAGES") &&
    !message.member.roles.cache.some((r) => r.name === "Giveaways")
  ) {
    return message.channel.send(
      "You need to have the manage messages permissions or a role called Giveaways."
    );
  }

  let giveawayChannel = message.mentions.channels.first();
  if (args[0] === "here") giveawayChannel = message.channel;
  if (!giveawayChannel)
    return message.channel.send(
      em(
        `Failure!`,
        `Please provide a channel, or use the "here" keyword!`,
        `bruh`,
        `RED`
      )
    );
  args.shift();
  let giveawayDuration = args.shift();
  if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
    return message.channel.send(
      em("Failure!", "You have to specify a valid duration!", "dummy", "RED")
    );
  }

  let giveawayNumberWinners = args.shift();
  if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
    return message.channel.send(
      em(
        "Failure!",
        "You have to specify a valid number of winners!",
        "dummy",
        "RED"
      )
    );
  }

  let giveawayPrize = args.join(" ");
  client.giveawaysManager.start(giveawayChannel, {
    time: ms(giveawayDuration),
    prize: giveawayPrize,
    winnerCount: parseInt(giveawayNumberWinners),
    hostedBy: client.config.hostedBy ? message.author : null,
    messages: {
      giveaway:
        (client.config.everyoneMention ? "<@&831996472458477588>\n" : "") +
        "🎉 **GIVEAWAY** 🎉",
      giveawayEnded:
        (client.config.everyoneMention ? "<@&831996472458477588>\n" : "") +
        "🎉 **GIVEAWAY ENDED** 🎉",
      timeRemaining: "Time remaining: **{duration}**!",
      inviteToParticipate: "React with 🎉 to participate!",
      winMessage: "Congratulations, {winners}! You won **{prize}**!",
      embedFooter: "Giveaways",
      embedColor: "#00ff66",
      noWinner: "Giveaway cancelled, no valid participations.", // brb
      hostedBy: "Hosted by: {user}",
      winners: "winner(s)",
      endedAt: "Ended at",
      units: {
        seconds: "seconds",
        minutes: "minutes",
        hours: "hours",
        days: "days",
        pluralS: false,
      },
    },
  });

  message.channel.send(
    em(`Success!`, `Giveaway started in ${giveawayChannel}`)
  );
  message.delete();
};
exports.help = {
  name: "gstart",
  description: "Starts a giveaway",
  enabled: true,
  aliases: ["gs"],
  usage: "[channel] [time] [winners] [prize]",
  category: "Giveaways",
};

exports.data = {
  userPermissions: [],
  userMode: 0, // set this to a number to determined how many of the above permissions the user needs to have.
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
