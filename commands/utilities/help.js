/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const conf = require('../../json/configuration.json');
const failureEmbed = require('../../functions/failure-embed');

module.exports = {
	help: {
		name: 'help',
		description: 'Displays the commands',
		usage: '[command name or category]',
		aliases: alias.utilities.help,
		category: 'utilities',
		cooldown: 1,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		const prefix = process.argv.length > 2 ? conf.betaPrefix : conf.prefix;
		const categories = ['utilities', 'giveaways', 'staff', 'developers'];
		const embed = new MessageEmbed()
			.setDescription(`This server's prefix is \`${prefix}\``)
			.setColor('RANDOM');
		if (!args[0]) {
			embed.setAuthor('Help Menu', client.user.avatarURL());
			for (const c of categories) {
				const cmds = client.commands.filter(cmd => cmd.help.category === c).map(cmd => cmd.help.name).join(', ');
				embed.addField(`${c.charAt(0).toUpperCase()}${c.slice(1)}`, `\`${cmds}\``);
			}
		}
		else if (categories.includes(args[0].toLowerCase())) {
			embed.setAuthor(`Category Info: ${args[0].toLowerCase()}`, client.user.avatarURL());
			const cmds = client.commands.filter(cmd => cmd.help.category === args[0].toLowerCase());
			cmds.forEach(c => embed.addField(
				`${c.help.name.charAt(0).toUpperCase()}${c.help.name.slice(1)}`,
				`**Description:** ${c.help.description}\n**Usage:** \`${prefix}${c.help.name} ${c.help.usage}\`\n**Aliases:** ${c.help.aliases.join(', ')}\n**Cooldown:** ${c.help.cooldown} seconds`,
			));
		}
		else if (client.commands.get(args[0])) {
			const c = client.commands.get(args[0]);
			embed
				.setAuthor(`Command Info: ${c.help.name}`, client.user.avatarURL())
				.addField(
					`${c.help.name.charAt(0).toUpperCase()}${c.help.name.slice(1)}`,
					`**Description:** ${c.help.description}\n**Usage:** \`${prefix}${c.help.name} ${c.help.usage}\`\n**Aliases:** ${c.help.aliases.join(', ')}\n**Cooldown:** ${c.help.cooldown} seconds`,
				);
		}
		else {
			return message.channel.send(failureEmbed('I couldn\'t find a command with this name!', `Run '${prefix}help' to see a list of all commands`));
		}
		return message.channel.send(embed);
	},
};
