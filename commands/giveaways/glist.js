/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'glist',
		description: 'Lists all active giveaways.',
		usage: 'None',
		aliases: alias.giveaways.glist,
		category: 'giveaways',
		cooldown: 15,
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
		const allGiveaways = await client.giveawaysManager.giveaways;
		const onServer = allGiveaways.filter(
			(g) => g.guildID === '831995980097388604',
		);
		const notEnded = onServer.filter((g) => !g.ended);
		if (!notEnded.length) {
			if (!notEnded.length) {
				const em = new MessageEmbed()
					.setTitle('Active giveaways')
					.setDescription('There are no active giveaways!')
					.setFooter('sad')
					.setColor('YELLOW');
				return message.channel.send(em);
			}
			const embed = new MessageEmbed()
				.sesetTitle('Active giveaways')
				.setFooter('wooooo')
				.setColor('GREEN');
			for (const entry of notEnded) {
				const timestamp = new Date(entry.endAt);
				embed.addField(
					entry.prize,
					`**Hosted by:** ${entry.hostedBy}\n**Channel:** <#${
						entry.channelID
					}>\n**Ends on:** ${timestamp.toLocaleString('en-US', {
						timeZone: 'UTC',
					})} UTC\n**Winners:** ${entry.winnerCount}\n\n_ _`,
				);
			}
			message.channel.send(embed);
		}
	},
};