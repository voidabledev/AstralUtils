/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');

module.exports = {
	help: {
		name: 'bal',
		description: 'Shows the amount of money you have.',
		usage: '(User ID)',
		aliases: alias.economy.balance,
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
			return message.channel.send(
				failureEmbed(`${user.id === message.author.id ? 'You have' : 'This user has'} no coins.`),
			);
		}
		const embed = new MessageEmbed()
			.setTitle(`${user.username}'s balance`)
			.addField('Wallet', `${profile.wallet} coins`)
			.addField('Bank',
				message.author.id === user.id ?
					`${profile.bank.value}/${profile.bank.capacity} coins` :
					`${profile.bank.value} coins`,
			)
			.setColor((profile.wallet > 0 && profile.bank.value > 0) ? 'GREEN' : 'RED');
		message.channel.send(embed);
	},
};