const Discord = require("discord.js");
const config = require("../config.json");
const categ = require("../utils/categories");
module.exports = async (client, message) => {
  const em = client.em;
  if (message.author.bot) return;

  client.autoresponder(client, message);
  const bl = await client.blacklisted(message.author.id);
  if (bl) return;
  let prefix = client.config.prefix;
  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  const cmd =
    client.commands.get(command) ||
    client.commands.find(
      (c) => c.help.aliases && c.help.aliases.includes(command)
    );

  if (!cmd) return;
  if (!cmd.help.enabled) {
    return message.channel.send(
      cmd.errors.disabled ||
        em(
          `Failure!`,
          `This command has been disabled!`,
          `run ${prefix}help for a list of commands`,
          `#7a1b07`
        )
    );
  }

  if (cmd.data.userPermissions.length) {
    client.validatePermissions(cmd.data.userPermissions);
    let i = 0;
    for (permission of cmd.data.userPermissions) {
      if (message.member.hasPermission(permission)) i++;
    }
    if (
      (cmd.data.userMode > 0 && i < cmd.data.userMode) ||
      (cmd.data.userMode === 0 && i < cmd.data.userPermissions.length)
    ) {
      return message.channel.send(
        cmd.errors.userPerms ||
          em(
            `Failure!`,
            `You don't have permission to use this command!`,
            `come back when you're more respected`,
            `#7a1b07`
          )
      );
    }
  }

  if (cmd.data.botPermissions.length) {
    //
    // same thing as above, but checks the bot's perms
    client.validatePermissions(cmd.data.botPermissions); // kk
    let i = 0;
    for (permission of cmd.data.botPermissions) {
      if (message.guild.me.hasPermission(permission)) i++;
    }
    if (
      (cmd.data.botMode > 0 && i < cmd.data.botMode) ||
      (cmd.data.botMode === 0 && i < cmd.data.botPermissions.length)
    ) {
      return message.channel.send(
        cmd.errors.botPerms ||
          em(
            `Failure!`,
            `I don't have the required permissions to run this command!`,
            `Please message a server admin to fix my perms.`,
            `#7a1b07`
          )
      );
    }
  }

  if (
    args.length < cmd.data.minArgs ||
    (cmd.data.maxArgs && args.length > cmd.data.maxArgs)
  ) {
    return message.channel.send(
      cmd.errors.wrongUsage ||
        em(
          `Failure!`,
          `Wrong usage! The correct syntax for this command is:\n\`${config.prefix}${cmd.help.name} ${cmd.help.usage}\``,
          `run ${config.prefix}help ${cmd.help.name} for more info`,
          `#7a1b07`
        )
    );
  }
  try {
    cmd.run(client, message, args);
    if (categ.validate(cmd, categ.valid) === "Moderation" && !cmd.data.noDel)
      message.delete();
  } catch (e) {
    message.channel.send(
      cmd.errors.other ||
        em(
          `Failure!`,
          `There was an error trying to run this command.`,
          `get gud noob`,
          `#7a1b07`
        )
    );
    return console.error(e);
  }
};
