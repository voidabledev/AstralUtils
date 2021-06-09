/* eslint-disable no-unused-vars */
const punish = require('../models/punishschema');
const { modlogs } = require('../json/channels.json');
const id = require('./id');
const { MessageEmbed } = require('discord.js');
async function processLog(data, client) {
	let punishID = id(10, 10);
	const channel = client.channels.cache.get(modlogs);
	while(await punish.findOne({ punishID })) {
		punishID = id(10, 10);
	}
	data.punishID = punishID;
	await punish.create(data);
	const embed = new MessageEmbed()
		.setTitle('Case ID', data.punishID)
		.addField('Type', data.caseType)
		.addField('User', `<@${data.userID}> (${data.userID})`)
		.addField('Moderator', `<@${data.staffID}> (${data.userID})`)
		.addField('Reason', data.reason)
		.setTimestamp(data.timestamp)
		.setColor('RANDOM');
	const webhooks = await channel.fetchWebhooks();
	const webhook = webhooks.size ? webhooks.first() : await channel.createWebhook(client.user.username, {
		avatar: client.user.avatarURL(),
	});
	webhook.send({
		username: client.user.username,
		avatarURL: client.user.avatarURL(),
		embeds: [embed],
	});
	return punishID;
}
module.exports = processLog;