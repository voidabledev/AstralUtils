/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');

module.exports = {
	help: {
		name: 'gamble',
		description: 'Bet some money, win or lose.',
		usage: '(amount or "all")',
		aliases: alias.economy.gamble,
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
		const horseshoe = profile.items.gamble;
		const amount = !isNaN(args[0]) ? Math.min(parseInt(args[0]), 50000) :
			!isNaN(args[0].slice(0, -1)) && args[0].endsWith('k') ? 1000 * parseInt(args[0].slice(0, -1)) :
				args[0] === 'all' ? Math.min(profile.wallet, 50000) :
					0;
		if (!amount || amount < 0) {
			return message.channel.send(failureEmbed('Try again, but this time tell me how much to bet.'));
		}
		if (amount > profile.wallet) {
			return message.channel.send(failureEmbed('You don\'t have that much!'));
		}
		const yourRoll = Math.floor(Math.random() * 20);
		const myRoll = Math.floor(Math.random() * 20);
		const embed = new MessageEmbed()
			.setAuthor(`${message.author.username}'s gambling game`)
			.addField(message.author.username, yourRoll)
			.addField(client.user.username, myRoll);
		if (yourRoll === myRoll) {
			embed
				.setDescription('**Tied!** Your balance didn\'t change.')
				.setColor('YELLOW');
		}
		if (yourRoll < myRoll) {
			embed
				.setDescription(`**You lose!** You lost ${amount} coins. ${
					horseshoe ? 'Your horseshoe broke.' : ''
				}`)
				.setColor('RED');
			await eco.updateOne(profile, {
				$inc: {
					wallet: -amount,
					'items.gamble': horseshoe ? -1 : 0,
				},
			});
		}
		if (yourRoll > myRoll) {
			embed
				.setDescription(`**You win!** You won ${horseshoe ? amount * 1.5 : amount} coins${
					horseshoe ? ' (50% boost using a gambler\'s horseshoe).' : '.'
				}`)
				.setColor('GREEN');
			await eco.updateOne(profile, {
				$inc: {
					wallet: horseshoe ? amount * 1.5 : amount,
				},
			});
		}
		return message.channel.send(embed);
	},
};