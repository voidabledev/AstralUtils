/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const shop = require('../../functions/eco-system');
const eco = require('../../models/ecoschema');

module.exports = {
	help: {
		name: 'shop',
		description: 'View the items in the shop.',
		usage: '(page)',
		aliases: alias.economy.shop,
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
		const pages = 1 + Math.floor((shop.items.length - 1) / 25);
		const page = parseInt(args[0]) || 1;
		const filter = (entry, index) => index >= 25 * (page - 1) && index < 25 * page;
		const display = shop.items.filter(filter);
		const embed = new MessageEmbed()
			.setTitle('Shop')
			.setDescription('You can buy an item using `>buy [item]`.')
			.setFooter(`Page ${page}/${pages}.`);
		display.forEach((e) => {
			embed.addField(e.displayName,
				`**Item ID:** ${e.name}\n**Description:** ${e.description}\n**Cost:** ${e.cost}\n**Shows in inventory?:** ${e.inv ? 'Yes' : 'No'}`,
			);
		});
		message.channel.send(embed);
	},
};