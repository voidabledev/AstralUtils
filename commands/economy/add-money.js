/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');

module.exports = {
	help: {
		name: 'add-money',
		description: 'Adds money to a user\'s balance.',
		usage: '[User mention or ID] [Amount]',
		aliases: alias.economy.addmoney,
		category: 'economy',
		cooldown: 15,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['836583124283686943', '831996396684050443', '831996396151636029', '849345871929802772'],
		delete: false,
	},
	async execute(message, args, client) {
		const user = message.mentions.users.first() || await client.users.fetch(args[0]);
		if (!user) {
			return message.channel.send(failureEmbed('Please specify a user mention or ID!'));
		}
		const amount = !isNaN(args[1]) ? parseInt(args[1]) :
			!isNaN(args[1].slice(0, -1)) && args[1].slice(-1) === 'k' ? 1000 * parseInt(args[1].slice(0, -1)) :
				0;
		if (!amount) {
			return message.channel.send(failureEmbed('Please specify a valid amount!'));
		}
		const profile = await eco.findOneAndUpdate({
			userID: user.id,
		}, {
			$inc: {
				wallet: amount,
			},
		});
		if (!profile) {
			return message.channel.send(failureEmbed('I couldn\'t find any data for this user.'));
		}
		return message.channel.send(successEmbed(`Gave ${user} ${amount} coins.`));
	},
};