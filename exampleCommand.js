/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');

module.exports = {
	help: {
		name: String,
		description: String,
		usage: String,
		aliases: alias.commandCategory.commandName,
		category: String,
		cooldown: Number,
	},
	data: {
		minArgs: Number,
		maxArgs: Number || null,
		userPerms: [String],
		botPerms: [String],
		requiredRoles: [String],
		delete: Boolean,
	},
	async execute(message, args, client) {
		// Code here
	},
};