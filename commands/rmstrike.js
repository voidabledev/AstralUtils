const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const strikeSchema = require("../schemas/strikeschema");
  const strikeId = args.shift();
  const reason = args.join(" ") || "No reason provided";
  const strike = await strikeSchema.findOneAndDelete({
    strikeId,
  });
  if (!strike)
    return message.channel.send(
      em(`Failure!`, `I couldn't find a strike associated with this ID!`)
    );
  const logChannel = message.guild.channels.cache.get("831996554763829338");
  const user =
    client.users.cache.get(strike.userId) || client.users.fetch(strike.userId);
  let notifiedUser; 
  let deletedMessage;
  user
    ? await user
        .send(
          new MessageEmbed()
            .setDescription(
              `Your strike with ID \`${strikeId}\` has been revoked by ${message.author} for \`${reason}\``
            )
            .setColor("GREEN")
        )
        .then(() => (notifiedUser = true))
        .catch(() => (notifiedUser = false))
    : (notifiedUser = false);
  await logChannel.messages
    .delete(strike.messageId)
    .then(() => (deletedMessage = true))
    .catch(() => (deletedMessage = false));
  message.channel.send(
    em(
      `Success!`,
      `${user} ${
        notifiedUser ? "has" : "hasn't"
      } been notified. The message in ${logChannel} ${
        deletedMessage ? "has" : "hasn't"
      } been deleted.`,
      `yay`,
      `GREEN`
    )
  );
};
exports.help = {
  name: "rmstrike",
  description: "Removes a strike by ID",
  enabled: true,
  aliases: ["rms"],
  usage: "[strike id] [reason]",
  category: "Administration",
};

exports.data = {
  userPermissions: ["ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 0, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 1,
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
