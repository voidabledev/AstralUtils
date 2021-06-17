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
			.setDescription(`This server's prefix is \`${prefix}\`.\nThe arguments with \`[]\` are required and with \`()\` are optional`)
			.setColor('RANDOM');
		if (!args[0]) {
			embed.setAuthor('Help Menu', client.user.avatarURL());
			for (const c of categories) {
				const cmds = client.commands.filter(cmd => cmd.help.category === c).map(cmd => cmd.help.name).join(', ');
				embed.addField(`${c.charAt(0).toUpperCase()}${c.slice(1)}`, `\`${cmds}\``);
			}
		}
		else if (client.commands.get(args[0].toLowerCase()) ||
		client.commands.find(c => c.help.aliases.some(a => a === args[0].toLowerCase()))) {
			const c = client.commands.get(args[0].toLowerCase()) ||
			client.commands.find(cmd => cmd.help.aliases.some(a => a === args[0].toLowerCase()));
			embed.setAuthor(`Command Info: ${c.help.name}`, client.user.displayAvatarURL());
			embed.addField(`${c.help.name.charAt(0).toUpperCase()}${c.help.name.slice(1)}`,
				`**Description:** ${c.help.description}\n**Usage:** \`${prefix}${c.help.name} ${c.help.usage}\`\n**Aliases:** \`${c.help.aliases.join(', ')}\`\n**Cooldown:** ${c.help.cooldown} seconds`);
		}
		else {
			return message.channel.send(
				new MessageEmbed()
					.setAuthor(client.user.username, client.user.displayAvatarURL())
					.setDescription('I couldn\'t find that command! Run `>help` for a list of commands.')
					.setColor('RED')
					.setTimestamp(),
			);
		}
		return message.channel.send(embed);
	},
};
