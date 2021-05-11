const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const mongo = require("../mongo");
const warnSchema = require("../schemas/warnschema");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const makeID = client.makeID;
  const ml = client.setModlog;
  let target = message.mentions.users.first();
  if (!target) {
    const targetMember = await message.guild.members.fetch(args[0]);
    target = targetMember.user;
  }
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
  const reason = args.join(" ");
  let warnID = makeID(36, 8);

  let warning = {
    author: message.member.user.tag,
    timestamp: new Date().getTime(),
    reason,
    warnID,
  };

  let modlog = {
    author: message.author.tag,
    reason,
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "warning",
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
      `You have been warned in **${message.guild.name}** for \`${reason}\``
    )
    .setColor("RED");
  await target.send(embed);

  await mongo().then(async (mongoose) => {
    let overlap;
    do {
      overlap = await warnSchema.findOne({
        warnings: { warnID },
      });
      if (overlap) warnID = makeID(36, 8);
    } while (overlap);
    message.channel.send(
      em(
        `Success!`,
        `Warned **${target.tag}** with ID \`${warnID}\``,
        `the user is a dum dum`,
        `#00ff66`
      )
    );
    warning.warnID = warnID;
    try {
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
    } finally {
      mongoose.connection.close();
    }
  });
  ml(userId, guildId, modlog, client);
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
