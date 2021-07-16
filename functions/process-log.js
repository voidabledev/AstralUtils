/* eslint-disable no-unused-vars */
const punish = require('../models/punishschema');
const { modlogs, automod } = require('../json/channels.json');
const id = require('./id');
const { MessageEmbed } = require('discord.js');
/**
 * Adds a modlog to the database and sends it to a logging channel via webhook.
 * @param {Object} data The modlog's data.
 * @param {string} data.guildID The ID of the guild this was issued from.
 * @param {string} data.userID The user this log belongs to.
 * @param {string} data.staffID The moderator who issued this.
 * @param {string} data.reason The reason for this log.
 * @param {string} data.caseType The type of modlog this is.
 * @param {number} data.timestamp The time this modlog was created at.
 * @param {number?} data.expires The time this modlog will expire.
 * @param {boolean?} data.isActive Whether the modlog is active. Should be set to true if the log expires.
 * @param {Object} client The discord.js client.
 * @returns {string} The punishment ID.
 */
async function processLog(data, client) {
	let punishID = id(10, 10);
	const channel = client.channels.cache.get(data.staffID === client.user.id ? automod : modlogs);
	while (await punish.findOne({ punishID })) {
		punishID = id(10, 10);
	}
	data.punishID = punishID;
	await punish.create(data);
	const embed = new MessageEmbed()
		.setTitle(`Case ID #${data.punishID}`)
		.addField('Type', data.caseType)
		.addField('User', `<@${data.userID}> (${data.userID})`);
	channel.id === modlogs ? embed.addField('Moderator', `<@${data.staffID}> (${data.staffID})`) : null;
	embed.addField('Reason', data.reason)
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