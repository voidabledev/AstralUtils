/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');

module.exports = {
	help: {
		name: 'deposit',
		description: 'Deposit an amount of coins into your bank account.',
		usage: '[amount or "all"]',
		aliases: alias.economy.deposit,
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
			return message.channel.send(failureEmbed('You don\'t have any money to deposit!'));
		}
		const amount = !isNaN(args[0]) ? parseInt(args[0]) :
			!isNaN(args[0].slice(0, -1)) && args[0].slice(-1) === 'k' ? 1000 * parseInt(args[0].slice(0, -1)) :
				args[0] === 'all' ? Math.min(profile.wallet, profile.bank.capacity - profile.bank.value) :
					0;
		if (!amount) {
			return message.channel.send(failureEmbed('Please tell me how much to deposit, dummy.'));
		}
		if (amount > profile.wallet) {
			return message.channel.send(failureEmbed('You don\'t have enough money to deposit that much!'));
		}
		if(amount + profile.bank.value > profile.bank.capacity || amount === 0) {
			return message.channel.send(failureEmbed('Your bank is already full!'));
		}
		await eco.updateOne(profile, {
			$inc: {
				wallet: -amount,
				'bank.value': amount,
			},
		});
		return message.channel.send(successEmbed(`Deposited ${amount} coins!`));
	},
};