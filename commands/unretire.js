const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const role = message.guild.roles.cache.find(
    (r) => r.name.toLowerCase() === "former staff"
  );
  const { member } = message;
  const reason = args.join(" ");

  if (!member.roles.cache.get(role.id))
    return message.channel.send(
      em(`Failure!`, `You have to be a Retired Staff to use this command.`)
    );
  message.guild.channels
    .create(`${member.user.username}-unretirement`, {
      type: "text",
      topic: reason,
      permissionOverwrites: [
        {
          id: message.guild.roles.everyone,
          deny: "VIEW_CHANNEL",
        },
        {
          id: member.id,
          allow: "VIEW_CHANNEL",
        },
      ],
    })
    .then((channel) => {
      const embed = new MessageEmbed()
        .setTitle(`Unretirement of ${member.user.tag}`)
        .setDescription(`**Reason:** ${reason}`)
        .setFooter(`User ID: ${member.id}`);
      channel.send(`<@${member.id}> <@&836295798852550686>`, embed);
    });
};
exports.help = {
  name: "unretire",
  description: "Makes you unretire.",
  enabled: false,
  aliases: ["unr"],
  usage: "[reason]",
  category: "Moderation",
};

exports.data = {
  userPermissions: [],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 1,
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
