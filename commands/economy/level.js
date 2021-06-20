/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');

module.exports = {
	help: {
		name: 'level',
		description: 'Display your or someone else\'s level.',
		usage: '(User mention or ID)',
		aliases: alias.economy.level,
		category: 'economy',
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
	async execute(message, args, client) {
		const user = message.mentions.users.first() ? message.mentions.users.first() :
			args[0] ? await client.users.fetch(args[0]) :
				message.author;
		const profile = await eco.findOne({ userID: user.id });
		if (!profile) {
			return message.channel.send(failureEmbed('No level found.'));
		}
		const total = 100 * (profile.level + 1);
		const embed = new MessageEmbed()
			.setAuthor(user.tag)
			.setColor(message.guild.me.displayColor)
			.addField('Level', profile.level)
			.addField('EXP', `${
				profile.exp < 1000 ? profile.exp : (profile.exp / 1000).toFixed(1) + 'k'
			} / ${total < 1000 ? total : (total / 1000).toFixed(1) + 'k'}`);
		message.channel.send(embed);
	},
};