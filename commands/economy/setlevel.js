/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');

module.exports = {
	help: {
		name: 'setlevel',
		description: 'Sets the level of a user.',
		usage: '[user mention or id] [new level]',
		aliases: alias.economy.setlevel,
		category: 'economy',
		cooldown: 15,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['836583124283686943', '831996396684050443', '831996396151636029'],
		delete: false,
	},
	async execute(message, args, client) {
		const user = message.mentions.users.first() ? message.mentions.users.first() :
			args[0] ? await client.users.fetch(args[0]) :
				message.author;
		const level = parseInt(args[1]);
		if (level < 0 || level > 100) return message.channel.send(failureEmbed('Please provide a valid level between 0 and 100!'));
		await eco.updateOne({ userID: user.id }, {
			level,
			exp: 0,
		});
		return message.channel.send(successEmbed(`Set ${user}'s level to \`${level}\`.`));
	},
};