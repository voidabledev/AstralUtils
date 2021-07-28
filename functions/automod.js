/* eslint-disable no-unused-vars */
const bl = require('../models/blacklistschema');
const { MessageEmbed } = require('discord.js');
const log = require('./process-log');
const punish = require('../models/punishschema');

function checkExec(trig, message, client) {
	if (
		(trig.type === 'exact' && trig.content.some((c => c === message.content))) ||
		(trig.type === 'exact-anycase' && trig.content.some(c => c.toLowerCase() === message.content.toLowerCase())) ||
		(trig.type === 'wildcard' && trig.content.some(c => message.content.includes(c))) ||
		(trig.type === 'wildcard-anycase' && trig.content.some(c => message.content.toLowerCase().includes(c.toLowerCase()))) ||
		(trig.type === 'attachment' && message.attachments && message.attachments.find(
			(a) => !trig.content.some(c => a.name.toLowerCase().endsWith(c)),
		)) ||
		(trig.type === 'spam' && client.spam.get(message.author.id).length >= trig.content[0])
	) return true;
	return false;
}
function checkAccess(message, action) {
	if (
		((action.blacklist.channels.length &&
			action.blacklist.channels.some(
				(c) => c === message.channel.id || c === 'all',
			)) ||
			(action.blacklist.categories.length &&
				action.blacklist.categories.some(
					/* eslint-disable-next-line */
					(c) =>  message.channel.parent && c === message.channel.parent.id
				))) &&
		!(
			(action.whitelist.channels.length &&
				action.whitelist.channels.some((c) => c === message.channel.id)) ||
			(action.whitelist.categories.length &&
				action.whitelist.categories.some(
					(c) => c === message.channel.parent.id,
				))
		)
	) {
		return false;
	}
	if (
		(action.blacklist.roles.length &&
			action.blacklist.roles.some((r1) =>
				message.member && message.member.roles.cache.find((r2) => r2.id === r1),
			)) ||
		(action.blacklist.permissions.length &&
			action.blacklist.permissions.some((p) =>
				message.member && message.member.hasPermission(p),
			)) ||
		(action.blacklist.users.length &&
			action.blacklist.users.some(
				(u) => u === message.author.id || u === 'all',
			))
	) {
		if (
			(action.whitelist.roles.length &&
				action.whitelist.roles.some((r1) =>
					message.member && message.member.roles.cache.find((r2) => r2.id === r1),
				)) ||
			(action.whitelist.permissions.length &&
				action.whitelist.permissions.some((p) =>
					message.member && message.member.hasPermission(p),
				)) ||
			(action.whitelist.users.length &&
				action.whitelist.users.some((u) => u === message.author.id))
		) {
			return true;
		}
		return false;
	}
	return true;
}
const exec = {
	'delete': async (message) => message.delete(),
	'message': async (message, args) => {
		const m = message.channel.send(
			args[0]
				.replace('%u', `<@${message.author.id}>`)
				.replace('%c', `<#${message.channel.id}>`),
		);
		if (args[1]) {
			setTimeout(() => m.delete(), args[1]);
		}
	},
	'embed': async (message, args) => {
		const embed = new MessageEmbed();
		if (args[0]) {
			embed.setTitle(args[0]);
		}
		if (args[1]) {
			embed.setDescription(args[1]
				.replace('%u', `<@${message.author.id}>`)
				.replace('%c', `<#${message.channel.id}>`),
			);
		}
		if (args[2]) {
			embed.setFooter(args[2]);
		}
		if (args[3]) {
			embed.setColor(args[3] || 'RANDOM');
		}
		if (args[4]) {
			embed.setTimestamp();
		}
		const m = await message.channel.send(embed);
		if (args[5]) {
			setTimeout(() => m.delete(), args[5]);
		}
	},
	'warn': async (message, args, client) => {
		const punishment = await log({
			guildID: message.guild.id,
			userID: message.author.id,
			staffID: client.user.id,
			reason: args[0],
			caseType: 'Warn',
			timestamp: new Date().getTime(),
			expires: Date.now() + 1000 * 60 * 60 * 24 * 30,
			isActive: true,
		}, client);
		try {
			const embed = new MessageEmbed()
				.setAuthor(client.user.username, client.user.displayAvatarURL())
				.setTitle(`You've been warned in ${message.guild.name}`)
				.addField('Reason', args[0].replace('%c', `<#${message.channel.id}>`))
				.setFooter(`Punishment ID: ${punishment}`);
			message.author.send(embed);
		}
		catch (e) {
			// sorry no sorry, you don't get to know your warning
		}
	},
	'mute': async (message, args, client) => {
		try {
			const role = await message.guild.roles.cache.find(
				(r) => r.name.toLowerCase() === 'muted',
			);
			if (!role) return;
			message.member.roles.add(role);
		}
		catch (e) {
			return;
		}
		const punishmute = await log({
			guildID: message.guild.id,
			userID: message.author.id,
			staffID: client.user.id,
			reason: args[0].replace('%c', `<#${message.channel.id}>`),
			caseType: 'Mute',
			timestamp: new Date().getTime(),
			expires: Date.now() + args[1],
			isActive: true,
		}, client);
		const embed = new MessageEmbed()
			.setAuthor(client.user.username, client.user.displayAvatarURL())
			.setTitle(`You've been muted in ${message.guild.name}`)
			.addField('Reason', args[0].replace('%c', `<#${message.channel.id}>`))
			.setFooter(`Punishment ID: ${punishmute}`);
		try {
			message.author.send(embed);
		}
		catch (e) {
			// sorry no sorry, you are muted but don't know why
		}
	},
	'ban': async (message, args, client) => {
		if (!message.member.bannable) return;
		const punishban = await log({
			guildID: message.guild.id,
			userID: message.author.id,
			staffID: client.user.id,
			reason: args[0].replace('%c', `<#${message.channel.id}>`),
			caseType: 'Ban',
			timestamp: new Date().getTime(),
		}, client);
		const embed = new MessageEmbed()
			.setAuthor(client.user.username, client.user.displayAvatarURL())
			.setTitle(`You've been banned in ${message.guild.name}`)
			.addField('Reason', args[0].replace('%c', `<#${message.channel.id}>`))
			.setFooter(`Punishment ID: ${punishban}`);
		try {
			await message.author.send(embed).then(() => {
				message.guild.members.ban(message.author.id);
			});
		}
		catch (e) {
			// you don't get to know why you got banned because you have dms off... sucks to suck
		}
	},
	'warn-mute': async (message, args, client) => {
		const warnExists = await punish.findOne({
			staffID: client.user.id,
			reason: args[0],
			isActive: true,
		});
		if (warnExists) {
			exec.warn(message, args, client);
		}
		else {
			exec.mute(message, args, client);
		}
	},
};
/**
 * Checks the specified message for automod.
 * @param message The message to check with the automod.
 * @param client The discord.js client.
 * @returns {void} Nothing.
 */
function automod(message, client) {
	if (!message.guild) return;
	const spam = client.spam.get(message.author.id) || [];
	spam.push(new Date().getTime());
	client.spam.set(message.author.id, spam.filter((s) => s > new Date().getTime() - 2000));
	const data = require('../json/automod.json');
	data.settings.forEach(async (entry) => {
		if (entry.triggers.some((v) => checkExec(v, message, client))) {
			entry.actions
				.filter((a) => checkAccess(message, a))
				.forEach((a) => exec[a.name](message, a.args, client));
		}
	});
}
module.exports = automod;