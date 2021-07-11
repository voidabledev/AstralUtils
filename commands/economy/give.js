/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');

module.exports = {
	help: {
		name: 'give',
		description: 'Give money to someone else.',
		usage: '[user mention or ID] [amount]',
		aliases: alias.economy.give,
		category: 'economy',
		cooldown: 10,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		const user = message.mentions.users.first() || await client.users.fetch(args[0]);
		if (!user) {
			return message.channel.send(failureEmbed('That isn\'t a valid user!'));
		}
		const amount = !isNaN(args[1]) ? parseInt(args[1]) :
			!isNaN(args[1].slice(0, -1)) && args[1].slice(-1) === 'k' ? 1000 * parseInt(args[1].slice(0, -1)) :
				0;
		if (!amount || amount < 0) {
			return message.channel.send(failureEmbed('Try again, but this time specifiy an actual amount...'));
		}
		const profile = await eco.findOne({ userID: message.author.id });
		if (amount > profile.wallet) {
			return message.channel.send(failureEmbed('You don\'t have that much!'));
		}
		await eco.updateOne({ userID: message.author.id }, {
			$inc: {
				wallet: -amount,
			},
		});
		await eco.updateOne({ userID: user.id }, {
			$inc: {
				wallet: amount,
			},
		});
		message.channel.send(successEmbed(`You gave ${user} ${amount} coins.`));
	},
};