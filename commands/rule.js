const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  let number = args.shift(" ");

  if (number === "1")
    message.channel.send(
      em(
        `Respect`,
        `Treat everyone in the server with respect, both the staff and the members. Treat everybody how you would want to be treated.`
      )
    );
  if (number === "2")
    message.channel.send(
      em(
        `Spamming`,
        `No spamming or flooding text channels. This includes excessive characters or emojis in one message and spamming messages containing the same or similar content. This also includes spam pinging a user.`
      )
    );
  if (number === "3")
    message.channel.send(
      em(
        `Drama`,
        `This includes bashing or having heated arguments against other people. Please take these types of things into DMs.`
      )
    );
  if (number === "4")
    message.channel.send(
      em(
        `Advertising`,
        `No advertising allowed in the server. This includes DM advertising or posting social media links in text channels. The only place you can advertise is in the Advertisement channels.`
      )
    );
  if (number === "5")
    message.channel.send(
      em(
        `Channel Topics`,
        `Use channels for their correct purpose. For example use bots in the <#831996529425514517> channel and chat in <#831996525864419348>.`
      )
    );
  if (number === "6")
    message.channel.send(
      em(
        `NSFW`,
        `Anything NSFW or 18+ is not allowed on the server. This includes NSFW images, language, and other NSFW topics. Please take it somewhere else.`
      )
    );
  if (number === "7")
    message.channel.send(
      em(
        `Discrimination`,
        `Not racism or any kind of discrimination against an individual or group (racial slurs are not allowed).`
      )
    );
  if (number === "8")
    message.channel.send(
      em(
        `Swearing`,
        `Swearing is allowed, but not if it is directed towards a user or group.`
      )
    );
  if (number === "9")
    message.channel.send(
      em(
        `Begging`,
        `No begging or repeatedly asking in the chat for something.`
      )
    );
  if (number === "10")
    message.channel.send(
      em(
        `Name and PFP Restrictions`,
        `No names, nicknames or profile pictures that are offensive towards a user or group of people. Another restriction is to keep nicknames pingable on the English keyboard.`
      )
    );
  if (number === "11")
    message.channel.send(
      em(
        `Language`,
        `Please use the English language throughout the server. If you choose to use another language, please take it to another server or through DMs.`
      )
    );
  if (number === "12")
    message.channel.send(
      em(
        `Alt Accounts`,
        `No malicious usage of alternative accounts, especially if used to evade punishments or get more entries on giveaways. If caught, you will be punished.`
      )
    );
  if (number === "13")
    message.channel.send(
      em(
        `Impersonation`,
        `Impersonation of people/bots with profile pictures/names isn't allowed.`
      )
    );
  if (number === "14")
    message.channel.send(
      em(
        `Mod's Duties`,
        `No interfering with moderator's duties. This includes not arguing with them while they actively moderate, not trolling with fake evidence and not misinforming other users with false information.`
      )
    );
  if (number === "15")
    message.channel.send(
      em(
        `Earrape`,
        `Do not cause annoying, loud, or high pitched noises. This includes using music bots to do so, or by screaming/yelling into your microphone.`
      )
    );
  if (number === "16")
    message.channel.send(
      em(
        `Voice Changers`,
        `Do not use voice changers, soundboards, or other related programs to alter your voice, unless others are fine with it.`
      )
    );
  if (number === "17")
    message.channel.send(
      em(
        `Background Noises`,
        `No loud or obnoxious background noise. Please mute your microphone, or use push to talk if needed.`
      )
    );
};
exports.help = {
  name: "rule",
  description: "Displays a rule",
  enabled: true,
  aliases: [],
  usage: "[number]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES"],
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
