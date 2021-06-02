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
		if (!args.length) {
			message.channel.send(`The current slowmode in the channel is \`${message.channel.rateLimitPerUser}\` seconds.`);
		}
		const amount = parseInt(args[0]);
		message.channel.setRateLimitPerUser(amount);
		if (amount === 0) {
			message.channel.send('Slowmode has been turned off. Go crazy!');
			return;
		}
		message.channel.send(`I've set the channel slowmode to \`${amount}\` seconds.`);
	},
};