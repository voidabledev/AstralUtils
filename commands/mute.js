const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  const ml = client.setModlog;
  const ms = client.millis;
  await message.guild.roles.fetch();
  const author = message.author;
  const member =
    message.mentions.members.first() ||
    (await message.guild.members.get(args[0]));
  const role = message.guild.roles.cache.find(
    (r) => r.name.toLowerCase() === "muted"
  );
  let time = ms(args[1]);
  if (time > 0) args.shift();
  let reason = "";
  if (!args[1]) reason = "No reason specified";
  else reason = args.slice(1).join(" ");
  if (!member)
    return message.channel.send(
      em(
        `Failure!`,
        `You didn't provide a user. Please mention one or enter a valid user ID.`,
        `lmfao what a noob`,
        `#7a1b07`
      )
    );
  if (member.roles.cache.find((r) => r.name.toLowerCase() === "muted"))
    return message.channel.send(
      em(
        `Failure!`,
        `${member} is already muted! Unmute them first to mute them again.`,
        `lmao what a noob`,
        `#7a1b07`
      )
    );
  if (member.id === message.author.id)
    return message.channel.send(
      em(
        `Failure!`,
        `You can't mute yourself dummy!`,
        `lmao what a noob`,
        `#7a1b07`
      )
    );
  if (member.id === client.user.id)
    return message.channel.send(
      em(
        `Failure!`,
        `You can't mute me! I'm the muter, remember?`,
        `lmao can't use a mute cmd`,
        `#7a1b07`
      )
    );
  if (message.member.roles.highest.position <= member.roles.highest.position)
    return message.channel.send(
      em(
        `Failure!`,
        `You can't mute a user above you! You have to be promoted first.`,
        `lol`,
        `#7a1b07`
      )
    );
  if (!role) {
    const Embed = new Discord.MessageEmbed()
      .setTitle("Muting Error!")
      .setDescription(
        "It appears that your discord server does not currently have a `Muted` role.\n\nWould you like to generate one?"
      )
      .setColor("#7a1b07");
    message.channel.send(Embed).then(async (message) => {
      await message.react("✅");
      await message.react("❌");

      const filtro = (reaction, user) =>
        ["✅", "❌"].includes(reaction.emoji.name) && user.id === author.id;
      const collector = message.createReactionCollector(filtro);

      collector.on("collect", async (r) => {
        switch (r.emoji.name) {
          case "✅":
            if (message.guild.roles.cache.size >= 250) {
              message.channel.send(
                " Failed to generate a `Muted` role. Your server has too many roles! [250]\nMore information can be found at: https://discordia.me/en/server-limits"
              );
              collector.stop();
              break;
            }
            message.reactions.removeAll();
            const mutedRole = await message.guild.roles.create({
              data: {
                name: "Muted",
                color: "GRAY",
              },
            });
            message.channel.send(
              em(
                "Created role!",
                "A `Muted` role has been created.",
                "mod abuse go brrrr"
              )
            );
            message.guild.channels.cache.forEach(async (channel, id) => {
              await channel.createOverwrite(mutedRole, {
                READ_MESSAGES: false,
                SEND_MESSAGES: false,
                READ_MESSAGE_HISTORY: false,
                ADD_REACTIONS: false,
                VIEW_CHANNEL: false,
                CONNECT: false,
                SPEAK: false,
              });
            });
            member.roles.add(mutedRole);
            message.channel.send(
              em(
                `Success!`,
                `${member} has been successfully muted for \`${reason}\`!`,
                `mod abuse go brrr`,
                `#00ff66`
              )
            );
            collector.stop();
            break;
          case "❌":
            message.channel.send(
              em(
                `Cancelled!`,
                "The creation of a `Muted` role has been cancelled.",
                `lol`,
                `RED`
              )
            );
            collector.stop();
            return;
        }
      });
    });
  } else {
    member.roles.add(role);
    message.channel.send(
      em(
        `Success!`,
        `${member} has been successfully muted for \`${reason}\`!`,
        `mod abuse go brrrr`,
        `#00ff66`
      )
    );
  }
  try {
    const embed = new MessageEmbed()
      .setDescription(
        `You have been muted in **${message.guild.name}** for \`${reason}\``
      )
      .setColor("RED");
    await member.user.send(embed);
  } catch (err) {
    message.channel.send(
      `I was unable to DM this user. The infraction has been logged.`
    );
  }

  const userId = member.id;
  const guildId = message.guild.id;
  let modlog = {
    author: message.author.id,
    reason,
    caseID: 0,
    timestamp: new Date().getTime(),
    _type: "Muted a member",
  };
  ml(userId, guildId, modlog, client);
  if (time > 0) {
    let timestamp = new Date().setTime(new Date().getTime() + time);
    client.addTimer("mute", userId, guildId, timestamp);
  }
  const mongo = require("../mongo");
  const muteschema = require("../schemas/muteschema");
  await mongo().then(async (mongoose) => {
    try {
      await muteschema.create({
        userId,
        guildId,
      });
    } finally {
      mongoose.connection.close();
    }
  });
};

exports.help = {
  name: "mute",
  description: "Mutes a member.",
  enabled: true,
  aliases: ["m"],
  usage: "[member] [reason]",
  category: "Moderation",
};

exports.data = {
  userPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
  userMode: 1, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: ["MANAGE_ROLES", "MANAGE_CHANNELS"], // if no permissions are required, leave the array empty and set the Mode to 0
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
