const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

// To be done
exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ignored = new Set([
    "831996546651652106",
    "831996547624468520",
    "831996548723900446",
    "831996549763956776",
    "831996553672654878",
    "831996551475757077",
    "831996554763829338",
    "841807446498738177",
    "831996556999000085",
    "831996552666152990",
    "831996564327235634",
    "831996564817182792",
    "831996566310617178",
    "836631694660075550",
    "831996568676204584",
    "831996569715867701",
    "831996570823688202",
    "831996575735742514",
    "831996576778944612",
    "831996577690288188",
    "831996578637152336",
    "831996579665281054",
    "831996580739153920",
    "831996581981061132",
    "832023373470105700",
    "832023386611384320",
  ]);
  const validateFlag = (f) => f === "true" || f === "false" || f === "null";

  let [roleId, flag] = args.split(" ");
  if (!isNaN(roleId) && validateFlag(flag.toLowerCase())) {
    if (message.guild.roles.cache.has(roleId)) {
      flag =
        flag.toLowerCase() === "true"
          ? true
          : flag.toLowerCase() === "false"
          ? false
          : null;
    }
  }
  const channels = message.guild.channel.cache.filter(
    (ch) => ch.type !== "category"
  );
  channels.forEach;
  (channel) => {
    if (!ignored.has(channel.id)) {
      channel
        .updateOverwrite(roleId, {
          SEND_MESSAGES: !flag,
          CONNECT: !flag,
          SPEAK: !flag,
        })
        .then((g) => {
          message.channel.send();
        });
    }
  };
};
exports.help = {
  name: "lockserver",
  description: "Locks the server",
  enabled: false,
  aliases: ["ls"],
  usage: "[role id] [reason] [true/false/null]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_ROLES", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 0,
  maxArgs: 3,
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
