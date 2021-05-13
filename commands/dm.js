const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const u = message.mentions.users.first() || client.users.cache.get(args[0]);

  const msg = args.splice(1).join(" ");

  if (!u) {
    message.channel
      .send(
        em(
          `Failure!`,
          `Please provide a user to DM.`,
          `doesn't know even how to use a dm cmd`,
          `RED`
        )
      )
      .then((m) => {
        m.delete({ timeout: 10000 });
        message.delete({ timeout: 10000 });
      });
    return;
  }

  if (!msg) {
    message.channel
      .send(em(`Failure!`, `Please provide a message.`, `bruh moment`, `RED`))
      .then((m) => {
        m.delete({ timeout: 10000 });
        message.delete({ timeout: 10000 });
      });
    return;
  }

  try {
    u.send(
      em(
        `Direct message`,
        `From **${message.guild.name}**\n${msg}`,
        `You were direct messaged by ${message.author.name}`
      )
    );
  } catch (e) {
    message.channel.send(em(`Failure!`, `I can't DM that user.`, `lol`, `RED`));
  }

  message.channel.send(
    em(`Success!`, `I've sent the message to ${u}`, `you learned!`, `#00ff00`)
  );
};
exports.help = {
  name: "dm",
  description: "Direct messages a user",
  enabled: true,
  aliases: [],
  usage: "[user] [message]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES"],
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
