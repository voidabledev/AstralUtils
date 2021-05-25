// Packages you will need...
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'announce',
	description: 'Announce something',
	aliases: ['a'] || alias.admin.announce,
	cooldown: 5,
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
