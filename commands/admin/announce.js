// Packages you will need...
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'announce',
		description: 'Sends an announcement',
		usage: '[Message]',
		aliases: alias.admin.announce,
		category: 'admin',
		cooldown: 5,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: ['ADMINISTRATOR'],
		botPerms: [],
		requiredRoles: [],
		delete: true,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.avatarURL())
			.setDescription(args.join(' '))
			.setFooter('Announcement')
			.setTimestamp();
		message.delete();
		message.channel.send(embed);
	},
};