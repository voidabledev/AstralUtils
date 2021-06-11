/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const { MessageEmbed } = require('discord.js');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const log = require('../../functions/process-log');

module.exports = {
	help: {
		name: 'admingive',
		description: 'Gives a user administrator.',
		usage: '[user]',
		aliases: alias.admin.admingive,
		category: 'admin',
		cooldown: 30,
	},
	data: {
		minArgs: 1,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['836583124283686943', '689175390471979178', '831996396151636029'],
		delete: false,
	},
	async execute(message, args, client) {
		const adminperms = message.guild.roles.cache.get('836295798852550686');
		const adminrole = message.guild.roles.cache.get('831996399209414697');
		const target = message.mentions.members.first() ||
    (await message.guild.members.fetch(args[0]));
		if (target.id === message.author.id) {
			return message.channel.send(failureEmbed('You can\'t give Admin to yourself, because you already have Admin.'));
		}
		if (target.id === client.user.id) {
			return message.channel.send(failureEmbed('You can\'t give me Admin.'));
		}
		if (target.roles.cache.find(r => r.name.toLowerCase() === 'admin perms')) {
			return message.channel.send(failureEmbed('That user already has Admin.'));
		}
		target.roles.add(adminperms);
		target.roles.add(adminrole);
		message.channel.send(successEmbed(`You've given Admin to ${target}.`));
	},
};