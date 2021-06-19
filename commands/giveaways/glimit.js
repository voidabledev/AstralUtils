/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'glimit',
		description: 'Displays how many giveaways have been hosted in the last day, and when the next one is allowed to be hosted.',
		usage: 'None',
		aliases: alias.giveaways.glimit,
		category: 'giveaways',
		cooldown: 20,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['831996436333592586', '851144985800736788'],
		delete: false,
	},
	async execute(message, args, client) {
		const limit = client.giveawaysManager.limitPerDay;
		const withinaday = client.giveawaysManager.giveaways.filter(
			(g) => new Date().getTime() - g.startAt < 1000 * 60 * 60 * 24,
		);
		const starts = withinaday.map((gw) => gw.startAt);
		const nextToExpire = Math.min(...starts);
		const embed = new MessageEmbed().setTitle(
			`${withinaday.length} giveaways in the last day`,
		);
		if (withinaday.length < limit) {
			embed
				.setColor('GREEN')
				.setDescription(
					`${limit - withinaday.length} more giveaways can be hosted.`,
				)
				.setFooter('Another one will be available')
				.setTimestamp(nextToExpire ? nextToExpire + 1000 * 60 * 60 * 24 : new Date().getTime());
		}
		else {
			embed
				.setColor('RED')
				.setDescription('Currently, no more giveaways can be hosted.')
				.setFooter('One will be available to host at')
				.setTimestamp(nextToExpire + 1000 * 60 * 60 * 24);
		}
		return message.channel.send(embed);
	},
};