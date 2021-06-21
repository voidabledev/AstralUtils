/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');
const { items } = require('../../functions/eco-system');

module.exports = {
	help: {
		name: 'sell',
		description: 'Sells an item for 75% of its original price..',
		usage: '[item name] (amount)',
		aliases: alias.economy.sell,
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
		const shop = items.find((i) => i.name === item);
		const profile = await eco.findOne({ userID: message.author.id });
		const cost = Math.floor(shop.cost * amount * 0.75);
		if (!shop) return message.channel.send(failureEmbed('That item doesn\'t exist.'));
		if (!profile) {
			return message.channel.send(failureEmbed('You have no items, how would you sell any??'));
		}
		const amount = !isNaN(args[1]) ? parseInt(args[1]) :
			args[1] === 'all' ? profile.items[item] :
				1;
		if (profile.items[item] < amount) {
			return message.channel.send(failureEmbed('You don\'t have that many!'));
		}
		if(profile.items[item] === amount) {
			await eco.updateOne(profile, {
				$unset: {
					[`items.${item}`]: 0,
				},
				$inc: {
					wallet: cost,
				},
			});
		}
		else {
			await eco.updateOne(profile, {
				$inc: {
					[`items.${item}`]: -amount,
					wallet: cost,
				},
			});
		}
		return message.channel.send(
			successEmbed(`You sold ${amount} ${shop.displayName}(s) for ${cost} coins.`),
		);
	},
};