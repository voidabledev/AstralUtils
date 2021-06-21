/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const eco = require('../../models/ecoschema');

module.exports = {
	help: {
		name: 'work',
		description: 'Work to get money.',
		usage: 'None',
		aliases: alias.economy.work,
		category: 'economy',
		cooldown: 7200,
	},
	data: {
		minArgs: 0,
		maxArgs:  null,
		userPerms: [],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		const amount = 200 + Math.floor(Math.random() * 800);
		const profile = await eco.findOne({ userID: message.author.id });
		if (profile) {
			await eco.updateOne(profile, {
				$inc: {
					wallet: amount,
				},
			});
			return message.channel.send(successEmbed(`You worked and gained ${amount} coins.`));
		}
	},
};