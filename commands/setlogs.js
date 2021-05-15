const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const mongo = require("../mongo");
  const log = require("../schemas/logschema");

  try {
    let logChannel = message.mentions.channels.first();
    if (!logChannel) {
      await log.findOneAndDelete({
        guildId: message.guild.id,
      });
      const embed = new MessageEmbed()
        .setColor("#33ffb7")
        .setTitle("Log Channel")
        .setDescription(`${message.author.tag} changed Log Channel to \`None\``)
        .setFooter(`User ID: ${message.author.id}`);

      message.channel.send(embed);
      return;
    }

    const logFind = await log.findOne({
      guildId: message.guild.id,
    });

    if (!logFind) {
      const newLog = new log({
        guildId: message.guild.id,
        channelId: logChannel.id,
      });
      await newLog
        .save()
        .catch((err) =>
          message.channel.send(
            em(
              `Failure!`,
              `There's been an error:\n \`\`\`\n${err.message}\n\`\`\``,
              `lmao devs are noob`,
              `RED`
            )
          )
        );
    } else {
      await log.findOneAndUpdate(
        {
          guildId: message.guild.id,
        },
        {
          channelId: logChannel.id,
          guildId: message.guild.id,
        },
        {
          upsert: true,
        }
      );
    }

    const embed2 = new MessageEmbed()
      .setColor("33ffb7")
      .setTitle("Log Channel")
      .setDescription(`${message.author} changed Log Channel to ${logChannel}`);

    message.channel.send(embed2).catch(() => {});
  } catch (e) {
    message.reply("`[❌]` Error. Please report!").catch(() => {});
    console.error(e);
    return;
  }
};

exports.help = {
  name: "setlogs",
  description: "",
  enabled: true,
  aliases: ["setl"],
  hidden: true,
  usage: "[channel]",
};

exports.data = {
  userPermissions: ["MANAGE_GUILD", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: ["MANAGE_CHANNELS"], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 1, // same as above. Set it to 0 to require all perms to be fulfilled.
  minArgs: 0,
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
