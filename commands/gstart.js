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
  let ping = true;
  if (args[0].toLowerCase() === "noping") {
    ping = false;
    args.shift();
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

  const withinaday = client.giveawaysManager.giveaways.filter(
    (g) => new Date().getTime() - g.startAt < 1000 * 60 * 60 * 24
  );
  let stop;
  if (withinaday.length > 4) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
      await message.channel.send;
      await message.channel.send(
        em(
          `Attention!`,
          `There were already ${withinaday.length} giveaways within the last day. Respond with yes if you want to host this giveaway anyways.`,
          `say anything else to cancel`,
          `ORANGE`
        )
      );
      await message.channel
        .awaitMessages((m) => m.author.id === message.author.id, {
          max: 1,
          time: 60000,
          errors: ["time"],
        })
        .then((m) => {
          if (m.first().content.toLowerCase() === "yes") stop = false;
          else {
            stop = true;
            message.channel.send(`Giveaway creation cancelled.`);
          }
        })
        .catch(() => {
          stop = true;
          message.channel.send(
            `You didn't answer in time, giveaway creation cancelled.`
          );
        });
    } else {
      stop = true;
      message.channel.send(
        em(
          `Failure!`,
          `There are already ${withinaday.length} giveaways hosted within the last day, but only 5 are allowed!`,
          `Message an admin if this needs to be hosted anyways.`,
          `RED`
        )
      );
    }
  }
  if (stop) return;
  const exemptMembers = (member) => client.blacklisted(member.id);
  await client.giveawaysManager.start(giveawayChannel, {
    exemptMembers,
    time: ms(giveawayDuration),
    prize: giveawayPrize,
    winnerCount: parseInt(giveawayNumberWinners),
    hostedBy: client.config.hostedBy ? message.author : null,
    messages: {
      giveaway:
        (client.config.everyoneMention && ping
          ? "<@&831996472458477588>\n"
          : "") + "🎉 **GIVEAWAY** 🎉",
      giveawayEnded:
        (client.config.everyoneMention && ping
          ? "<@&831996472458477588>\n"
          : "") + "🎉 **GIVEAWAY ENDED** 🎉",
      timeRemaining: "Time remaining: **{duration}**!",
      inviteToParticipate: "React with 🎉 to participate!",
      winMessage: "Congratulations, {winners}! You won **{prize}**!",
      embedFooter: "Giveaways",
      embedColor: "#00ff66",
      noWinner: "Giveaway cancelled, no valid participations.",
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
    em(
      `Success!`,
      `Giveaway started in ${giveawayChannel}`,
      `${withinaday.length + 1} giveaways hosted within the last 24 hours`,
      `GREEN`
    )
  );
  message.delete();
};
exports.help = {
  name: "gstart",
  description: "Starts a giveaway",
  enabled: true,
  aliases: ["gs"],
  usage: "(optional: noping) [channel] [time] [winners] [prize]",
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
