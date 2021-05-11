const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { ownerIDs, prefix } = require("../config.json");

exports.run = async (client, message, args) => {
  const em = client.em;
  const yessir = client.yessir;
  let silent = args[0].toLowerCase() === "silent";
  if (silent) args.shift();
  let code = args.join(" ");

  if (!ownerIDs.includes(message.author.id))
    return message.channel.send(
      em(`Failure!`, `You aren't allowed to use this command.`, `bruh`, `RED`)
    );

  const embed = new Discord.MessageEmbed();
  if (message.content === `${prefix}eval 9+10`)
    return message.channel.send("21, You stupid");

  try {
    if (code.startsWith("```js") && code.endsWith("```"))
      code = code.slice(5, -3);
    let evaled = await eval(code);
    if (silent) return;
    if (evaled === undefined) evaled = "undefined";
    if (code.length > 1000) code = code.substring(0, 1000) + "...";
    if (typeof evaled !== "string") evaled = evaled.toString();
    if (evaled.length > 800) {
      evaled = evaled.substring(0, 800) + `...`;
    }
    embed
      .addField(`📥 Input`, `\`\`\`js\n${code}\n\`\`\``)
      .addField(`📤 Output`, `\`\`\`\n${evaled}\n\`\`\``)
      .setColor(client.color)
      .addField(`Status`, `Success`);
    return message.channel.send(embed);
  } catch (e) {
    console.log(e.stack);
    embed
      .addField(`📥 Input`, `\`\`\`js\n${code}\n\`\`\``)
      .addField(`📤 Output`, `\`\`\`\n${e}\n\`\`\``)
      .addField(`Status`, `Failed`)
      .setColor(client.color);
    return message.channel.send(embed);
  }
};

exports.help = {
  name: "eval",
  description: "Evaluate an expression in JS. Only available to owners.",
  enabled: true,
  aliases: ["ev"],
  usage: "[code]",
  hidden: true,
};

exports.data = {
  userPermissions: [],
  userMode: 0, // set this to a number to determined how many of the above permissions the user needs to have.
  botPermissions: [],
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
