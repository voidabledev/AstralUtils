const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const afkSchema = require('../models/afkschema');
async function checkAFK(message) {
	if (!message.guild) return;
	const guildId = message.guild.id;
	if (message.mentions.members.first()) {
		const results = await afkSchema.find({
			guildId,
		});

		if (results) {
			for (const res of results) {
				const { userId, afk, timestamp } = res;
				if (message.mentions.members.first().id === message.author.id) return;

				if (message.mentions.members.first().id === userId) {
					const member = message.guild.members.cache.get(userId);

					return message.channel.send(new MessageEmbed()
						.setColor(message.guild.me.displayColor)
						.setAuthor(`${member.user.username} is AFK`, member.user.displayAvatarURL())
						.setDescription(`\`${afk}\``)
						.setFooter(`${moment(timestamp).fromNow()}`));
				}
			}
		}
	}

	const afkResults = await afkSchema.find({
		guildId,
	});
	if (afkResults) {
		for (const res of afkResults) {
			const { userId, timestamp, username } = res;
			if (timestamp + (1000 * 10) <= new Date().getTime()) {
				if (message.author.id === userId) {
					await afkSchema.findOneAndDelete({
						guildId,
						userId,
					});
					message.member.setNickname(`${username}`).catch(() => {
						console.log('No Permissions.');
					});
					return message.channel.send(new MessageEmbed()
						.setColor(message.guild.me.displayColor)
						.setDescription(`Welcome back <@${message.member.id}>, I removed your afk`));
				}
			}
		}
	}
}
module.exports = checkAFK;