const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const mongo = require("../mongo");
const warnSchema = require("../schemas/warnschema");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const makeID = client.makeID;
  const ml = client.setModlog;
  let target =
    message.mentions.users.first() || (await client.users.fetch(args[0]));
  if (!target) {
    return message.channel.send(
      em(
        `Failure!`,
        `Please specify someone to warn.`,
        `what a noob lmao`,
        `#7a1b07`
      )
    );
  }

  args.shift();

  const guildId = message.guild.id;
  const userId = target.id;
  const reason = args.length ? args.join(" ") : "`No reason specified`";
  let warnID = makeID(36, 8);

  let warning = {
    author: message.author.id,
    timestamp: new Date().getTime(),
    reason,
    warnID,
    caseID: 0,
  };

  let modlog = {
    author: message.author.id,
    reason,
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "Warn",
  };

  if (target.id === client.user.id) {
    return message.channel.send(
      em(
        `Failure!`,
        `You can't warn me.`,
        `what a total dum dum lmao`,
        `#7a1b07`
      )
    );
  }
  if (target.id === message.author.id) {
    return message.channel.send(
      em(
        `Failure!`,
        `You can't warn yourself dummy!`,
        `what a dum dum`,
        `#7a1b07`
      )
    );
  }
  const embed = new MessageEmbed()
    .setDescription(
      `You have been warned in **${message.guild.name}** for \`${reason}\` with ID \`${warnID}\``
    )
    .setColor("RED");
  try {
    await target.send(embed);
  } catch (err) {
    message.channel.send(
      `I was unable to notify the user. Warning has been logged.`
    );
  }
  ml(userId, guildId, modlog, client);
  await warnSchema
    .find({ guildId }, (err, entries) => {
      if (err) throw err;
      retry: while (true) {
        for (let entry of entries) {
          if (entry.warnings.some((w) => w.warnID === warnID)) {
            warnID = makeID(36, 8);
            continue retry;
          }
        }
        break;
      }
    })
    .then(async () => {
      message.channel.send(
        em(
          `Success!`,
          `Warned **${target}** for \`${reason}\` with ID \`${warnID}\``,
          `the user is a dum dum`,
          `#00ff66`
        )
      );
      await warnSchema.findOneAndUpdate(
        {
          guildId,
          userId,
        },
        {
          guildId,
          userId,
          $push: {
            warnings: warning,
          },
        },
        {
          upsert: true,
        }
      );
    });
};
exports.help = {
  name: "warn",
  description: "Warns a member.",
  enabled: true,
  aliases: ["w"],
  usage: "[user] [reason]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 0,
  maxArgs: null,
};

exports.errors = {
  // edit this only if you want a custom message for this specific command.
  userPerms: null, // Else, it will default to an embed.
  botPerms: null,
  wrongUsage: null,
  disabled: `if you happen to see this, you're a noob. also tell the devs not to disable basic commands.`,
  other: null,
};
