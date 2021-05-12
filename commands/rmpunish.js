const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const warnSchema = require("../schemas/warnschema");
const mongo = require("../mongo");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;

  const punishid = args[0];
  if (!punishid) {
    message.channel
      .send(em(`Failure!`, `I need an punishment ID to delete!`))
      .then((m) => {
        m.delete({ timeout: 10000 });
        message.delete({ timeout: 10000 });
      });
  }

  const guildID = message.guild.id;

  await mongo().then(async (mongoose) => {
    try {
      const p = await warnSchema.findOne({
        _id: punishid,
        guildID,
      });
      p.validate(function (err) {
        if (err) console.log(err);
        else console.log("Deleted punishment");
      });
      await warnSchema.deleteOne({
        _id: punishid,
        guildID,
      });

      message.channel.send(
        em(`Success!`, `Deleted punishment \`${punishid}\`.`)
      );
    } catch (e) {
      message.channel.send(
        em(`Failure!`, `Did you provide a valid punishment?`)
      );
      console.log(e);
    }
  });
};
exports.help = {
  name: "",
  description: "",
  enabled: true,
  aliases: [],
  usage: "",
  category: "",
};

exports.data = {
  userPermissions: [],
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
