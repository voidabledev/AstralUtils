const Discord = require("discord.js");
const { MessageEmbed } = Discord;

module.exports = async (client) => {
  client.em = function (title, description, footer, color, author) {
    if (!color) color = "RANDOM";
    let embed = new Discord.MessageEmbed().setColor(color);
    if (author) embed.setAuthor(author, client.user.displayAvatarURL());

    if (title) embed.setTitle(title);

    if (description) embed.setDescription(description);

    if (footer) embed.setFooter(footer);

    return embed;
  };

  client.yessir = function (value) {
    if (!value) return "No";
    if (typeof value === "object" || typeof value === "array") {
      if (!value.length || !value.length <= 0) return "No";
      else return "Yes";
    }

    if (typeof value === "boolean") {
      if (value === true) return "Yes";
      if (value === false || value === null || value === undefined) return "No";
    }

    if (typeof value === "number") {
      if (!~value || value === 0) return "No";
      else return "Yes";
    }

    return "No";
  };

  client.validatePermissions = function (permissions) {
    const validPermissions = [
      "CREATE_INSTANT_INVITE",
      "KICK_MEMBERS",
      "BAN_MEMBERS",
      "ADMINISTRATOR",
      "MANAGE_CHANNELS",
      "MANAGE_GUILD",
      "ADD_REACTIONS",
      "VIEW_AUDIT_LOG",
      "PRIORITY_SPEAKER",
      "STREAM",
      "VIEW_CHANNEL",
      "SEND_MESSAGES",
      "SEND_TTS_MESSAGES",
      "MANAGE_MESSAGES",
      "EMBED_LINKS",
      "ATTACH_FILES",
      "READ_MESSAGE_HISTORY",
      "MENTION_EVERYONE",
      "USE_EXTERNAL_EMOJIS",
      "VIEW_GUILD_INSIGHTS",
      "CONNECT",
      "SPEAK",
      "MUTE_MEMBERS",
      "DEAFEN_MEMBERS",
      "MOVE_MEMBERS",
      "USE_VAD",
      "CHANGE_NICKNAME",
      "MANAGE_NICKNAMES",
      "MANAGE_ROLES",
      "MANAGE_WEBHOOKS",
      "MANAGE_EMOJIS",
    ];

    for (const permission of permissions) {
      if (!validPermissions.includes(permission)) {
        throw new Error(`Unknown permission node "${permission}"`);
      }
    }
  };

  client.makeID = (base, length) => {
    let id = Math.floor(Math.random() * base ** length).toString(base);
    while (id.length < length) {
      id = "0" + id;
    }
    return id;
  };

  client.setModlog = async (userId, guildId, modlog, client) => {
    const mongo = require("../mongo");
    const modSchema = require("../schemas/modschema");
    const logSchema = require("../schemas/logschema");
    let cid = 1;
    await modSchema.find({ guildId }, async (err, logs) => {
      if (err) throw err;
      logs.map((log) => {
        cid += log.modlogs.length;
      });
      modlog.caseID = cid;
      await modSchema.findOneAndUpdate(
        {
          guildId,
          userId,
        },
        {
          guildId,
          userId,
          $push: {
            modlogs: modlog,
          },
        },
        {
          upsert: true,
        }
      );
      const log = await logSchema.findOne({
        guildId,
        _type: "regular",
      });
      const automod = await logSchema.findOne({
        guildId,
        _type: "automod",
      });
      const isAutomod = modlog.author === "Automod";
      if (log?.channelId && !isAutomod) {
        const guild = client.guilds.cache.get(guildId);
        const channel = guild.channels.cache.get(log.channelId);
        const mod =
          modlog.author === "System" ? "System" : `<@${modlog.author}>`;
        let embed = new Discord.MessageEmbed()
          .setTitle(`Case #${modlog.caseID}`)
          .setDescription(
            `**User: **<@${userId}>\n**Moderator:** ${mod}\n**Type:** ${modlog._type}\n**Reason:** ${modlog.reason}`
          )
          .setFooter(`User ID: ${userId}`)
          .setColor("RANDOM");
        channel.send(embed);
      }
      if (automod?.channelId && isAutomod) {
        const guild = client.guilds.cache.get(guildId);
        const channel = guild.channels.cache.get(automod.channelId);
        let embed = new Discord.MessageEmbed()
          .setTitle(`Case #${modlog.caseID}`)
          .setDescription(
            `**User:** <@${userId}\n**Type:** ${modlog._type}\n**Reason:** ${modlog.reason}`
          )
          .setFooter(`User ID: ${userId}`)
          .setColor("RANDOM");
        channel.send(embed);
      }
    });
  };
  client.millis = (input) => {
    if (typeof input !== "string") return -1;
    if (isNaN(input.slice(0, -1))) return -1;
    const inputNumber = parseInt(input.slice(0, -1));
    if (input.endsWith("d")) return inputNumber * 1000 * 60 * 60 * 24;
    if (input.endsWith("h")) return inputNumber * 1000 * 60 * 60;
    if (input.endsWith("m")) return inputNumber * 1000 * 60;
    if (input.endsWith("s")) return inputNumber * 1000;
    return -1;
  };
  client.expire = {
    Mute: async (uid, gid, client) => {
      return new Promise(async (resolve, reject) => {
        const guild = client.guilds.cache.get(gid);
        if (!guild) resolve("Guild no longer exists");
        const role = await guild.roles.cache.find(
          (r) => r.name.toLowerCase() === "muted"
        );
        if (!role) reject("Muted role doesn't exist");
        const member = await guild.members.fetch(uid);
        if (!member) resolve("Member is not in this guild");
        if (!member.roles.cache.get(role.id))
          resolve("User has already been unmuted");
        member.roles.remove(role).catch(() => reject("User wasn't unmuted"));
        let modlog = {
          author: "System",
          reason: "Timed mute expired",
          caseID: 0,
          timestamp: new Date().getTime(),
          _type: "Unmute",
        };
        await client
          .setModlog(uid, gid, modlog, client)
          .catch(() => reject("Unable to set modlog"));
        const embed = new MessageEmbed()
          .setDescription(
            `You have been unmuted in **${guild.name}** for \`${modlog.reason}\``
          )
          .setColor("RED");
        await member.user
          .send(embed)
          .then(() => resolve("User unmuted and notified"))
          .catch(() => resolve("User unmuted, unable to notify"));
      });
    },
    Ban: async (uid, gid, client) => {
      const guild = client.guilds.cache.get(gid);
      if (!guild) return;
      const bans = await guild.fetchBans();
      const banned = await bans.find((b) => b.user.id === uid);
      if (!banned) return;
      await guild.members.unban(banned.user);
      member.roles.remove(role);
      let modlog = {
        author: "System",
        reason: "Timed ban expired",
        caseID: 0,
        timestamp: new Date().getTime(),
        _type: "Unban",
      };
      client.setModlog(uid, gid, modlog, client);
    },
  };
  client.addTimer = async (_type, userId, guildId, expires) => {
    const mongo = require("../mongo");
    const punishSchema = require("../schemas/punishschema");
    await punishSchema.create({
      _type,
      userId,
      guildId,
      expires,
    });
  };
  client.randomStatus = (client) => {
    const rand = [
      ["with the universe", "PLAYING", "online"],
      ["with the stars", "PLAYING", "idle"],
      ["with your computer", "PLAYING", "dnd"],
      ["Minecraft", "PLAYING", "dnd"],
      ["in the galaxy", "PLAYING", "online"],
      ["with your feelings", "PLAYING", "idle"],
      ["you", "WATCHING", "online"],
      ["space", "COMPETING", "dnd"],
      ["the sound of silence", "LISTENING", "idle"],
      ["over the galaxy", "WATCHING", "online"],
      ["the sky", "WATCHING", "dnd"],
      ["with code", "PLAYING", "idle"],
      ["you like a fiddle", "PLAYING", "online"],
      ["alone", "PLAYING", "dnd"],
      ["dead", "PLAYING", "idle"],
      ["Discord", "PLAYING", "online"],
      ["the sky", "WATCHING", "dnd"],
      ["with fire", "PLAYING", "idle"],
    ];
    const index = Math.floor(Math.random() * rand.length);
    client.user.setPresence({
      status: rand[index][2],
      activity: {
        name: `${rand[index][0]} | >help | v${
          require("../package.json").version
        }`,
        type: rand[index][1],
      },
    });
  };
  client.arUtil = {
    convert: async (action, client, message, args) => {
      if (action === "delete") {
        return message.delete();
      }
      if (action === "message") {
        return message.channel.send(args[0]);
      }
      if (action === "embed") {
        const embed = new Discord.MessageEmbed()
          .setTitle(args[0])
          .setDescription(args[1])
          .setFooter(args[2])
          .setColor(args[3]);
        return message.channel.send(embed);
      }
      if (action === "warn") {
        const modSchema = require("../schemas/modschema");
        const warnSchema = require("../schemas/warnschema");
        let warnID = client.makeID(36, 8);
        await warnSchema.find({ guildId: message.guild.id }, (err, entries) => {
          if (err) throw err;
          retry: while (true) {
            for (let entry of entries) {
              if (entry.warnings.some((w) => w.warnID === warnID)) {
                warnID = makeID(36, 8);
                continue retry;
              }
            }
            break;
          }
        });
        let warning = {
          author: "Automod",
          timestamp: new Date().getTime(),
          reason: args[0],
          warnID,
          caseID: 0,
        };

        let modlog = {
          author: "Automod",
          caseID: 0,
          reason: args[0],
          timestamp: new Date().getTime(),
          _type: "Warn",
        };
        await client.setModlog(
          message.author.id,
          message.guild.id,
          modlog,
          client
        );
        await warnSchema.findOneAndUpdate(
          {
            guildId: message.guild.id,
            userId: message.author.id,
          },
          {
            $push: {
              warnings: warning,
            },
          },
          {
            upsert: true,
          }
        );
        try {
          message.author.send(
            client.em(
              `Warning!`,
              `You got auto-warned in **${message.guild.name}** for \`${args[0]}\``
            )
          );
        } catch (e) {
          console.log(`Unable to DM User ${message.author.username}`);
        }
        return;
      }
      if (action === "mute") {
        let modlog = {
          author: "Automod",
          caseID: 0,
          reason: args[0],
          timestamp: new Date().getTime(),
          _type: "Mute",
        };
        client.setModlog(message.guild.id, message.author.id, modlog, client);
        const muteschema = require("../schemas/muteschema");
        await muteschema.create({
          userId: message.author.id,
          guildId: message.guild.id,
        });
        if (args[1] && args[1] > 0) {
          let timestamp = new Date().setTime(new Date().getTime() + args[1]);
          await client.addTimer(
            "Mute",
            message.author.id,
            message.guild.id,
            timestamp
          );
        }
        const embed = new Discord.MessageEmbed()
          .setTitle("Muted!")
          .setDescription(
            `You got auto-muted in **${message.guild.name}** for \`${
              modlog.reason
            }\`. You will be unmuted in ${Math.floor(args[1] / 60000)} minutes.`
          )
          .setColor("RANDOM");
        try {
          message.author.send(embed);
        } catch (e) {
          console.log("Unable to DM user");
        }
        try {
          const role = await message.guild.roles.cache.find(
            (r) => r.name.toLowerCase() === "muted"
          );
          if (!role) throw "No mute role found";
          message.member.roles.add(role).catch((e) => {
            throw "Unable to mute the user";
          });
        } catch (e) {
          console.log(
            `Failed to automute user ${message.author.username}: ${e}`
          );
        }
      }
    },
    checkAccess: (message, action) => {
      if (
        ((action.blacklist.channels.length &&
          action.blacklist.channels.some(
            (c) => c === message.channel.id || c === "all"
          )) ||
          (action.blacklist.categories.length &&
            action.blacklist.categories.some(
              (c) => c === message.channel.parent?.id
            ))) &&
        !(
          (action.whitelist.channels.length &&
            action.whitelist.channels.some((c) => c === message.channel.id)) ||
          (action.whitelist.categories.length &&
            action.whitelist.categories.some(
              (c) => c === message.channel.parent.id
            ))
        )
      )
        return false;
      if (
        (action.blacklist.roles.length &&
          action.blacklist.roles.some((r1) =>
            message.member?.roles.cache.find((r2) => r2.id === r1)
          )) ||
        (action.blacklist.permissions.length &&
          action.blacklist.permissions.some((p) =>
            message.member?.hasPermission(p)
          )) ||
        (action.blacklist.users.length &&
          action.blacklist.users.some(
            (u) => u === message.author.id || u === "all"
          )) ||
        (action.blacklist.full && client.blacklisted(message.author.id))
      ) {
        if (
          (action.whitelist.roles.length &&
            action.whitelist.roles.some((r1) =>
              message.member?.roles.cache.find((r2) => r2.id === r1)
            )) ||
          (action.whitelist.permissions.length &&
            action.whitelist.permissions.some((p) =>
              message.member?.hasPermission(p)
            )) ||
          (action.whitelist.users.length &&
            action.whitelist.users.some((u) => u === message.author.id))
        )
          return true;
        return false;
      }
      return true;
    },
    checkExecute: (trig, message, client) => {
      if (trig.type === "exact" && trig.content === message.content)
        return true;
      if (
        trig.type === "exact-anycase" &&
        trig.content.toLowerCase() === message.content.toLowerCase()
      )
        return true;
      if (trig.type === "wildcard" && message.content.includes(trig.content))
        return true;
      if (
        trig.type === "wildcard-anycase" &&
        message.content.toLowerCase().includes(trig.content.toLowerCase())
      )
        return true;
      return false;
    },
  };
  client.autoresponder = (client, message) => {
    const data = require("./autoresponder.json");
    data.settings.forEach(async (entry) => {
      if (
        entry.triggers.some((v) =>
          client.arUtil.checkExecute(v, message, client)
        )
      ) {
        entry.actions.forEach(async (action) => {
          if (client.arUtil.checkAccess(message, action))
            await client.arUtil.convert(
              action.name,
              client,
              message,
              action.args
            );
        });
      }
    });
  };
  client.blacklisted = async (userId) => {
    const mongo = require("../mongo");
    const blSchema = require("../schemas/blacklistschema");
    let bl = await blSchema.findOne({
      userId,
    });
    if (bl) return true;
    return false;
  };
};
