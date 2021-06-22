/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');

module.exports = {
	help: {
		name: 'withdraw',
		description: 'Withdraw an amount of coins into your bank account.',
		usage: '[amount or "all"]',
		aliases: alias.economy.withdraw,
		category: 'economy',
		cooldown: 10,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		const profile = await eco.findOne({ userID: message.author.id });
		if (!profile) {
			return message.channel.send(failureEmbed('You don\'t have any money on your bank account dummy!'));
		}
		const amount = !isNaN(args[0]) ? parseInt(args[0]) :
			!isNaN(args[0].slice(0, -1)) && args[0].slice(-1) === 'k' ? 1000 * parseInt(args[0].slice(0, -1)) :
				args[0] === 'all' ? profile.bank.value :
					0;
		if (!amount || amount < 0) {
			return message.channel.send(failureEmbed('Try again, but this time tell me how much to withdraw.'));
		}
		if (amount > profile.bank.value) {
			return message.channel.send(failureEmbed('You don\'t have enough money on your bank!'));
		}
		await eco.updateOne(profile, {
			$inc: {
				wallet: amount,
				'bank.value': -amount,
			},
		});
		message.channel.send(successEmbed(`Withdrew ${amount} coins!`));
	},
};