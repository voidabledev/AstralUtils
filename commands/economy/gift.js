/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');
const { items } = require('../../functions/eco-system');

module.exports = {
	help: {
		name: 'gift',
		description: 'Give somebody an item.',
		usage: '[user] [item name] (amount)',
		aliases: alias.economy.gift,
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
		const item = args[1];
		const shop = items.find((i) => i.name === item);
		const profile = await eco.findOne({ userID: message.author.id });
		const user = message.mentions.users.first() || await client.users.fetch(args[0]);
		const userProfile = await eco.findOne({ userID: user.id });
		if (!user) {
			return message.channel.send(failureEmbed('Please specify a user mention or ID!'));
		}
		if (!shop) return message.channel.send(failureEmbed('That item doesn\'t exist.'));
		if (!profile) {
			return message.channel.send(failureEmbed('You have no items, how would you give any away??'));
		}
		const amount = !isNaN(args[1]) ? parseInt(args[2]) :
			args[2] === 'all' ? profile.items[item] :
				1;
		if (profile.items[item] < amount) {
			return message.channel.send(failureEmbed('You don\'t have that many!'));
		}
		await eco.updateOne(profile, {
			$inc: {
				[`items.${item}`]: -amount,
			},
		});
		await eco.updateOne(userProfile, {
			$inc: {
				[`items.${item}`]: amount,
			},
		});
		return message.channel.send(
			successEmbed(`You gave ${amount} ${shop.displayName}(s) to ${user}.`),
		);
	},
};