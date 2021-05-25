/* eslint-disable no-unused-vars */
const punish = require('../models/punishschema');
const { modlogs } = require('../json/channels.json');
const id = require('./id');
const { MessageEmbed } = require('discord.js');
async function processLog(data, client) {
	let punishID = id(10, 10);
	const channel = client.guilds.cache.get(data.guildID).channels.cache.get(modlogs);
	/* eslint-disable-next-line no-constant-condition */
	while(true) {
		if(punish.findOne({ punishID })) {
			punishID = id(10, 10);
			continue;
		}
		break;
	}
	data.punishID = punishID;
	await punish.create(data);
	const embed = new MessageEmbed()
		.setTitle(`Case #${punishID}`)
		.setDescription(`**Type:** ${data.caseType}\n**User:** <@${data.userID}>\n**Moderator:** <@${data.staffID}>\n**Reason:** ${data.reason}`)
		.setTimestamp(data.timestamp)
		.setColor('#ff0066');
	channel.send(embed);
}
module.exports = processLog;