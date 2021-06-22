/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');
const { items } = require('../../functions/eco-system');

module.exports = {
	help: {
		name: 'buy',
		description: 'Buy an item from the shop.',
		usage: '[item name] (amount)',
		aliases: alias.economy.buy,
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
		const item = args[0];
		const amount = parseInt(args[1]) || 1;
		const shop = items.find((i) => i.name === item);
		const profile = await eco.findOne({ userID: message.author.id });
		if (!shop) return message.channel.send(failureEmbed('That item doesn\'t exist.'));
		if (!profile) {
			return message.channel.send(failureEmbed('What are you gonna buy without any coins??'));
		}
		if (profile.wallet < shop.cost * amount) return message.channel.send(failureEmbed('You don\'t have enough coins to buy this!'));
		if (shop.inv) {
			await eco.updateOne(profile, {
				$inc: {
					wallet: -(shop.cost * amount),
					[`items.${shop.name}`]: amount,
				},
			});
			message.channel.send(successEmbed(
				`You have bought ${amount} ${shop.displayName}(s) for ${shop.cost * amount} coins!`,
			));
		}
		else {
			try {
				await shop.allowed(message);
				const response = await shop.execute(message, amount);
				await eco.updateOne(profile, {
					$inc: {
						wallet: -amount * shop.cost,
					},
				});
				message.channel.send(successEmbed(response));
			}
			catch (e) {
				message.channel.send(failureEmbed(e.message));
			}
		}
	},
};