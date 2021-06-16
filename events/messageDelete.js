/* eslint-disable no-unused-vars */
const errEmbed = require('../functions/error-embed');
const failureEmbed = require('../functions/failure-embed');
const Discord = require('discord.js');
const conf = require('../json/configuration.json');

module.exports = {
	name: 'messageDelete',
	once: false,
	async execute(message, client) {
		client.snipes.set(message.channel.id, {
			content: message.content,
			author: message.author,
			image: message.attachments.first() ? message.attachments.first().proxyURL : null,
		});
	},
};