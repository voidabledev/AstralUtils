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
			message.channel.send(`The current slowmode in the channel is \`${message.channel.rateLimitPerUser}\` seconds.`);
			return;
		}
		// Trainee Moderator
		if (message.member.roles.cache.has('831996402619777045') && amount > 30) {
			message.channel.send(new MessageEmbed()
				.setTitle('Slowmode')
				.setDescription(`As a Trainne Moderator, you're restricted to \`30\` seconds. Are you sure you want to set the slowmode to \`${amount}?\``)
				.setFooter('Say yes or no'),
			);
			await message.channel.awaitMessages((m) => m.author.id === message.author.id, {
				max: 1,
				time: 60000,
				errors: ['time'],
			}).then(async (m) => {
				if (m.first().content.toLowerCase().includes('yes')) {
					message.channel.setRateLimitPerUser(amount);
					message.channel.send(`I've set the channel slowmode to \`${amount}\` seconds.`);
				}
				else {
					message.channel.send('Slowmode change canceled.');
				}
			});
			return;
		}
		// Moderator
		if (message.member.roles.cache.has('831996401872535573') && amount > 60) {
			message.channel.send(new MessageEmbed()
				.setTitle('Slowmode')
				.setDescription(`As a Moderator, you're restricted to \`60\` seconds. Are you sure you want to set the slowmode to \`${amount}\`?`)
				.setFooter('Say yes or no'),
			);
			await message.channel.awaitMessages((msg) => msg.author.id === message.author.id, {
				max: 1,
				time: 60000,
				errors: ['time'],
			}).then(async (msg) => {
				if (msg.first().content.toLowerCase().includes('yes')) {
					message.channel.setRateLimitPerUser(amount);
					message.channel.send(`I've set the channel slowmode to \`${amount}\` seconds.`);
				}
				else {
					message.channel.send('Slowmode change canceled.');
				}
			});
			return;
		}
		// Head Moderator
		if (message.member.roles.cache.has('831996400782016563') && amount > 200) {
			message.channel.send(new MessageEmbed()
				.setTitle('Slowmode')
				.setDescription(`As a Head Moderator, you're restricted to \`200\` seconds. Are you sure you want to set the slowmode to \`${amount}\`?`)
				.setFooter('Say yes or no'),
			);
			await message.channel.awaitMessages((msgs) => msgs.author.id === message.author.id, {
				max: 1,
				time: 60000,
				errors: ['time'],
			}).then(async (msgs) => {
				if (msgs.first().content.toLowerCase().includes('yes')) {
					message.channel.setRateLimitPerUser(amount);
					message.channel.send(`I've set the channel slowmode to \`${amount}\` seconds.`);
				}
				else {
					message.channel.send('Slowmode change canceled.');
				}
			});
			return;
		}
		// Normal (Admin or above)
		message.channel.setRateLimitPerUser(amount);
		if (amount === 0) {
			message.channel.send('Slowmode has been turned off. Go crazy!');
			return;
		}
		message.channel.send(`I've set the channel slowmode to \`${amount}\` seconds.`);
	},
};