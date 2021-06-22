/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const blackjack = require('discord-blackjack');
const eco = require('../../models/ecoschema');

module.exports = {
	help: {
		name: 'blackjack',
		description: 'Play a game of blackjack.',
		usage: '[amount or "all"]',
		aliases: alias.economy.blackjack,
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
		const horseshoe = profile.items.gamble > 0;
		const amount = !isNaN(args[0]) ? Math.min(parseInt(args[0]), 50000) :
			!isNaN(args[0].slice(0, -1)) && args[0].slice(-1) === 'k' ? Math.min(1000 * parseInt(args[0].slice(0, -1)), 50000) :
				args[0] === 'all' ? Math.min(profile.wallet, 50000) :
					0;
		if (!amount || amount < 0) return message.channel.send(failureEmbed('Try again, but this time tell me how much you wanna bet...'));
		if (amount > profile.wallet) return message.channel.send(failureEmbed('You don\'t even have that much.'));
		const embed = new MessageEmbed()
			.setAuthor(`${message.author.username}'s blackjack game`, message.author.avatarURL())
			.addFields(
				{ name: `${message.author.username}'s hand`, value: 'Cards: {yourcontent}\nTotal: {yvalue}' },
				{ name: 'Dealer\'s Hand', value: 'Cards: {dcontent}\nTotal: {dvalue}' },
			)
			.setFooter(`Bet: ${amount} coins`)
			.setColor('ORANGE');
		const game = await blackjack(message, client, {
			resultEmbed: false,
			normalEmbed: false,
			normalEmbedContent: embed,
		});
		const resultEmbed = new MessageEmbed()
			.setAuthor(`${message.author.username}'s blackjack game`, message.author.avatarURL())
			.addFields(
				{ name: `${message.author.username}'s hand`, value: `Cards: ${game.ycontent}\nTotal: ${game.yvalue}` },
				{ name: 'Dealer\'s Hand', value: `Cards: ${game.dcontent}\nTotal: ${game.dvalue}` },
			)
			.setFooter(`Bet: ${amount} coins`);
		console.log(game);
		switch (game.result) {
		case 'Win':
		case 'Double Win':
			resultEmbed
				.setDescription(`**You win - ${game.method}!** You won ${horseshoe ? Math.floor(amount * 1.5) : amount} coins. ${horseshoe ? '(50% boost using a gambler\'s horseshoe)' : ''}`)
				.setColor('GREEN');
			message.channel.send(resultEmbed);
			await eco.updateOne({ userID: message.author.id }, {
				$inc: {
					wallet: horseshoe ? Math.floor(amount * 1.5) : amount,
				},
			});
			break;

		case 'Tie':
			resultEmbed
				.setDescription('**Tie!** Your balance hasn\'t changed.')
				.setColor('ORANGE');
			message.channel.send(resultEmbed);
			break;

		case 'Lose':
		case 'Double Lose':
			resultEmbed
				.setDescription(`**You lose - ${game.method}!** You lost ${amount} coins. ${horseshoe ? 'Your horseshoe broke.' : ''}`)
				.setColor('RED');
			message.channel.send(resultEmbed);
			await eco.updateOne({ userID: message.author.id }, {
				$inc: {
					wallet: -amount,
					'items.gamble': horseshoe ? -1 : 0,
				},
			});
			break;

		case 'Cancel':
		case 'Timeout':
			resultEmbed
				.setDescription(`Game cancelled. The dealer kept your bet of ${amount} coins. ${horseshoe ? 'Your horseshoe broke.' : ''}`)
				.setColor('RED');
			message.channel.send(resultEmbed);
			await eco.updateOne({ userID: message.author.id }, {
				$inc: {
					wallet: -amount,
					'items.gamble': horseshoe ? -1 : 0,
				},
			});
			break;
		}
	},
};