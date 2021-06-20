/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');
const { items } = require('../../functions/eco-system');

module.exports = {
	help: {
		name: 'use',
		description: 'Use an item in your inventory.',
		usage: '[item name] (amount)',
		aliases: alias.economy.use,
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
		if (!shop) return message.channel.send(failureEmbed('That item doesn\'t exist.'));
		const profile = await eco.findOne({ userID: message.author.id });
		if (!profile) {
			return message.channel.send(failureEmbed('You don\'t have this item!'));
		}
		if (!profile.items[shop.name]) {
			return message.channel.send(failureEmbed('You don\'t have that item!'));
		}
		if (profile.items[shop.name] > amount) {
			return message.channel.send(failureEmbed('You don\'t have that many, what are you doing!??'));
		}
		shop.execute(message, amount)
			.then(async (r) => {
				await eco.updateOne(profile, {
					$inc: {
						[`items.${shop.name}`]: -amount,
					},
				});
				message.channel.send(successEmbed(r));
			})
			.catch((e) => {
				message.channel.send(failureEmbed(e.message));
			});
	},
};