/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');

module.exports = {
	help: {
		name: 'snipe',
		description: 'Displays the last deleted message in the channel.',
		usage: '',
		aliases: alias.staff.snipe,
		category: 'staff',
		cooldown: 10,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: ['MANAGE_MESSAGES'],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		const msg = client.snipes.get(message.channel.id);
		if (!msg) {
			return message.channel.send(failureEmbed('No messages deleted.'));
		}
		const embed = new MessageEmbed()
			.setAuthor(msg.author.username, msg.author.displayAvatarURL())
			.setDescription(msg.content)
			.setFooter('get sniped noob')
			.setColor('GREEN')
			.setTimestamp();
		if (msg.image) {
			embed.setImage(msg.image);
		}
		message.channel.send(embed);
	},
};