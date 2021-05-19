const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  let target = message.mentions.users.first();
  if (!target) target = await message.guild.members.fetch(args[0]);
  if (!target)
    return message.channel.send(
      em(
        `Failure!`,
        `You didn't provide a valid user mention or id!`,
        `get good noob`,
        `#7a1b07`
      )
    );
  if (target.id === client.user.id)
    return message.channel.send(
      em(
        `Failure!`,
        `You can't report me!`,
        `Trying to report a bug? Use the bugreport command!`,
        `#7a1b07`
      )
    );
  if (target.id === message.author.id)
    return message.channel.send(
      em(
        `Failure!`,
        `You can't report yourself!`,
        `why are you reporting yourself dummy?`,
        `#7a1b07`
      )
    );
  args.shift();
  const reason = args.join(" ");
  const reportChannel = await client.channels.fetch("841807446498738177");
  message.channel.send(
    em(
      `Success!`,
      `Your report was sent to the staff team.`,
      `report go brrrrr`
    )
  );
  return reportChannel.send(
    em(
      `Report`,
      `${message.author.username} reported ${target.username} for:\n${reason}`,
      `User ID: ${target.id}`
    )
  );
};
exports.help = {
  name: "report",
  description: "Report a user.",
  enabled: true,
  aliases: ["rp"],
  usage: "[mention or id] [reason]",
  category: "Moderation",
};

exports.data = {
  userPermissions: [],
  userMode: 0, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [],
  botMode: 0, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 2,
  maxArgs: null,
};

exports.errors = {
  // edit this only if you want a custom message for this specific command.
  userPerms: null, // Else, it will default to an embed.
  botPerms: null,
  wrongUsage: null,
  disabled: null,
  other: null,
};
