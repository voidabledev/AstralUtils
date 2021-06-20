/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');
const shop = require('../../functions/eco-system');

module.exports = {
	help: {
		name: 'inventory',
		description: 'Check your inventory.',
		usage: '(User mention or ID)',
		aliases: alias.economy.inventory,
		category: 'economy',
		cooldown: 10,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		const user = message.mentions.users.first() ? message.mentions.users.first() :
			args[0] ? await client.users.fetch(args[0]) :
				message.author;
		const profile = await eco.findOne({ userID: user.id });
		if (!profile) {
			return message.channel.send(failureEmbed(`${user.id === message.author.id ? 'You have' : 'This person has'} no items.`));
		}
		let totalItems = 0;
		let itemText = '';
		const embed = new MessageEmbed()
			.setAuthor(`${user.username}'s inventory`)
			.setColor('RANDOM');
		for(const i in profile.items) {
			totalItems += profile.items[i];
			itemText += `${profile.items[i]} x ${shop.items.find(it => it.name === i).displayName}\n`;
		}
		if (!itemText.length) {
			return message.channel.send(failureEmbed(`${user.id === message.author.id ? 'You have' : 'This person has'} no items.`));
		}
		embed
			.setDescription(itemText)
			.setFooter(`${totalItems} total items`);
		message.channel.send(embed);
	},
};