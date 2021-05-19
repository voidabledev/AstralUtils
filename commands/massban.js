const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  let reasonIndex;
  let response = "";
  args.forEach((id, index) => {
    if (id.length < 17) {
      reasonIndex = index;
      return;
    }
  });
  const reason = args.slice(reasonIndex).join(" ") || "No reason specified";
  const ids = args.slice(0, reasonIndex);
  ids
    .forEach(async (id) => {
      await message.guild.members
        .ban(id, { reason })
        .then(() => (response += `Banned <@${id}>\n`))
        .catch(() => (response += `Unable to ban <@${id}>\n`));
    })
    .then(() => {
      message.channel.send(
        em(
          `Mass ban`,
          response,
          `Mass bans aren't registered in modlogs`,
          `ORANGE`
        )
      );
    });
};
exports.help = {
  name: "massban",
  description: "Mass bans users",
  enabled: true,
  aliases: ["mb"],
  usage: "[user ids] [reason]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_ROLES"],
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
