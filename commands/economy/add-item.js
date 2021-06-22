/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');
const { items } = require('../../functions/eco-system');

module.exports = {
	help: {
		name: 'add-item',
		description: 'Add an item to someone\'s inventory.',
		usage: '[item name] (amount)',
		aliases: alias.economy.additem,
		category: 'economy',
		cooldown: 10,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['836583124283686943', '831996396684050443', '831996396151636029', '849345871929802772'],
		delete: false,
	},
	async execute(message, args, client) {
		const item = args[0];
		const amount = parseInt(args[1]) || 1;
		const shop = items.find((i) => i.name === item);
		const user = message.mentions.users.first() || await client.users.fetch(args[0]);
		if (!user) {
			return message.channel.send(failureEmbed('Please specify a user mention or ID!'));
		}
		const profile = await eco.findOne({ userID: user.id });
		if (!shop) return message.channel.send(failureEmbed('That item doesn\'t exist.'));
		if (!shop.inv) {
			return message.channel.send(failureEmbed('That item can\'t be added to the inventory!'));
		}
		await eco.updateOne(profile, {
			$add: {
				[`items.${item}`]: amount,
			},
		});
		message.channel.send(successEmbed(`Gave ${user} ${amount} ${shop.displayName}(s).`));
	},
};