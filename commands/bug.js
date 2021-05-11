const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const report = args.join(" ");
  if (report.length < 100)
    return message.channel.send(
      em(
        `Failure!`,
        `Your report is too short. Please provide a description of at least 100 characters`,
        `we can't fix it if you don't tell us exactly`,
        `#7a1b07`
      )
    );
  const channel = await client.channels.fetch("838641082161430558");
  message.channel.send(
    em(
      `Success!`,
      `Your bug report was sent to the development team!`,
      `pls no spam`,
      `#00ff66`
    )
  );
  return channel.send(
    em(`New bug report`, report, `Submitted by ${message.author.tag}`)
  );
};
exports.help = {
  name: "bug",
  description: "Report a bug to the development team.",
  enabled: true,
  aliases: ["bugreport"],
  usage: "[description]",
  category: "Development",
};

exports.data = {
  userPermissions: [],
  userMode: 0, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 0, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 1,
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
