/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../json/configuration.json');
const categ = require('../../functions/categories');
const failureEmbed = require('../../functions/failure-embed');
const isenabled = require('../../functions/isenabled');

module.exports = {
	help: {
		name: 'help',
		description: 'Displays the commands',
		usage: '(command name or category)',
		aliases: alias.utilities.help,
		category: 'utilities',
		cooldown: 10,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		const categories = ['admin', 'developers', 'staff', 'giveaways', 'utilities'];
		const embed = new MessageEmbed()
			.setAuthor('Help Menu', client.user.avatarURL())
			.setDescription(`This server's prefix is ${prefix}`)
			.setColor('RANDOM');
		if(!args[0]) {
			for(const c of categories) {
				const cmds = client.commands.filter(cmd => cmd.help.category === c).map(cmd => cmd.help.name).join(', ');
				embed.addField(`${c.charAt(0).toUpperCase()}${c.slice(1)}`, `\`${cmds}\``);
			}
		}
		else if(categories.includes(args[0].toLowerCase())) {
			const cmds = client.commands.filter(cmd => cmd.help.category === args[0].toLowerCase());
			cmds.forEach(c => embed.addField(`${c.help.name.charAt(0).toUpperCase()}${c.help.name.slice(1)}`));
		}
		else {
			//
		}
	},
};
