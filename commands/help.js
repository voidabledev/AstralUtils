const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config.json");
const categ = require("../utils/categories");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  if (args[0]) {
    if (categ.validateInput(args[0], categ.valid).length) {
      const category = categ.validateInput(args[0], categ.valid);
      let embed = new MessageEmbed()
        .setAuthor(`Category: ${category}`, client.user.avatarURL())
        .setDescription(`This server's prefix is \`${prefix}\``)
        .setColor("RANDOM")
        .setFooter("hehe boi");
      await client.commands.forEach((cmd) => {
        if (cmd.help.hidden) return;
        if (cmd.help.isAlias) return;
        if (categ.validate(cmd, categ.valid) !== category) return;
        const title = `__${cmd.help.name}__`;
        let field = `**Usage:** \`${prefix}${cmd.help.name} ${cmd.help.usage}\` \n**Desc:** ${cmd.help.description} \n`;
        if (cmd.help.aliases) {
          field += `**Aliases:** ${cmd.help.aliases}`;
        } else {
          field += `**Aliases:** None`;
        }
        embed.addField(title, field);
      });
      return message.channel.send(embed);
    } else {
      if (!client.commands.get(args[0]))
        return message.channel.send(
          em(
            "Command Not Found",
            "This command does not exist.",
            "give me an actual command dumbo",
            "#7a1b07"
          )
        );
      let command = client.commands.get(args[0]);
      if (command.help.hidden)
        return message.channel.send(
          em(
            "Command Not Found",
            "This command does not exist.",
            "give me an actual command dumbo",
            "#7a1b07"
          )
        );
      let embed = new MessageEmbed()
        .setAuthor(command.help.name, client.user.avatarURL())
        .setColor("RANDOM")
        .setDescription(command.help.description)
        .addField("Category", categ.validate(command, categ.valid));

      if (command.help.usage)
        embed.addField(
          "Usage",
          `\`\`\`${prefix}${command.help.name} ${command.help.usage}\`\`\``
        );

      if (command.help.aliases.length)
        embed.addField("Aliases", command.help.aliases.join(", "));
      else embed.addField("Aliases", "None");

      embed.addField("Enabled", yessir(command.help.enabled));

      return message.channel.send(embed);
    }
  } else {
    const embed = new MessageEmbed()
      .setAuthor("Help menu", client.user.avatarURL())
      .setDescription(`This server's prefix is \`${prefix}\``)
      .setFooter("hehe boi")
      .addField(
        `__Categories__`,
        `Listed below are all command categories and their respective commands. Use ${prefix}help [command or category] for more information on a specific command or category.`
      );
    categ.valid.forEach(async (v) => {
      let results = [];
      client.commands.forEach((cmd) => {
        if (cmd.help.hidden) return;
        if (categ.validate(cmd, categ.valid) === v) {
          results.push(cmd.help.name);
        }
      });
      embed.addField(v, `\`${results.join(", ")}\``);
    });
    message.channel.send(embed);
  }
};
exports.help = {
  name: "help",
  description:
    "Get a list of commands, or detailed information on commands in a category of a specific command.",
  enabled: true,
  aliases: [],
  usage: "[category | command (optional)]",
  category: "Information",
};

exports.data = {
  userPermissions: [],
  userMode: 0, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [], // if no permissions are required, leave the array empty and set the Mode to 0
  botMode: 0, // same as above. Set it to 0 to require all perms to be fulfilled.
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
