/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'slowmode',
		description: 'Sets slowmode in a channel',
		usage: '[seconds]',
		aliases: alias.staff.slowmode,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: ['MANAGE_MESSAGES'],
		botPerms: ['MANAGE_MESSAGES', 'MANAGE_CHANNELS'],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		const amount = parseInt(args[0]);
		if (!args.length) {
			message.channel.send(successEmbed(`The current slowmode in the channel is \`${message.channel.rateLimitPerUser}\` seconds.`));
			return;
		}
		let maxAmount = -1;
		let pos = '';
		if (message.member.roles.cache.get('831996402619777045')) {
			maxAmount = 30;
			pos = 'Trainee Moderator';
		}
		if (message.member.roles.cache.get('831996401872535573')) {
			maxAmount = 60;
			pos = 'Moderator';
		}
		if (message.member.roles.cache.get('831996400782016563')) {
			maxAmount = 200;
			pos = 'Head Moderator';
		}

		if (pos.length && amount > maxAmount) {
			message.channel.send(new MessageEmbed()
				.setTitle('Slowmode')
				.setDescription(`As a ${pos}, you're restricted to \`${maxAmount}\` seconds. Are you sure you want to set the slowmode to \`${amount}?\``)
				.setFooter('Say yes or no'),
			);
			const res = await message.channel.awaitMessages((m) => m.author.id === message.author.id, {
				max: 1,
				time: 60000,
				errors: ['time'],
			});
			if (!res.first().content.toLowerCase().includes('yes')) {
				return message.channel.send(failureEmbed('Slowmode change cancelled.'));
			}
		}
		message.channel.setRateLimitPerUser(amount);
		if (amount === 0) {
			message.channel.send(successEmbed('Slowmode has been turned off. Go crazy!'));
			return;
		}
		message.channel.send(successEmbed(`I've set the channel slowmode to \`${amount}\` seconds.`));
	},
};