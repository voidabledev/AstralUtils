const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModlog;

  const target =
    message.mentions.members.first() ||
    (await message.guild.members.fetch(args[0]));
  let nick = "";
  args.map((value, index) => {
    if (index !== 0) nick += value + " ";
  });
  target.setNickname(nick);
  const success = new MessageEmbed()
    .setTitle("Sucess!")
    .setColor("GREEN")
    .setDescription(`Succesfully changed ${target}'s username to ${nick}!`)
    .setFooter(`yay`);
  message.channel.send(success).catch((err) => {
    if (err) message.channel.send("**Something went wrong**");
  });

  const userId = target.id;
  const guildId = message.guild.id;
  let modlog = {
    author: message.author.id,
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "Changed Nickname",
  };
  ml(userId, guildId, modlog, client);
};

exports.help = {
  name: "nick",
  description: "Changes the nickname of a user.",
  enabled: true,
  aliases: ["n"],
  usage: "[user] [nickname]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_NICKNAMES"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 2,
  maxArgs: null,
  noDel: true, // change this to true if the command belongs to the "Moderation" category
}; // and you don't want to og message to be deleted.

exports.errors = {
  // edit this only if you want a custom message for this specific command.
  userPerms: null, // Else, it will default to an embed.
  botPerms: null,
  wrongUsage: null,
  disabled: null,
  other: null,
};
