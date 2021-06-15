/* eslint-disable no-unused-vars */
const bl = require('../models/blacklistschema');
const { MessageEmbed } = require('discord.js');
const log = require('./process-log');
function checkExec(trig, message, client) {
	if (
		(trig.type === 'exact' && trig.content === message.content) ||
		(trig.type === 'exact-anycase' && trig.content.toLowerCase() === message.content.toLowerCase()) ||
		(trig.type === 'wildcard' && message.content.includes(trig.content)) ||
		(trig.type === 'wildcard-anycase' && message.content.toLowerCase().includes(trig.content.toLowerCase()))
	) return true;
	return false;
}
async function checkAccess(message, action) {
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
		console.log(`Channel ${message.channel.name} is blocked from auto-action ${action.name}`);
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
			)) ||
		(action.blacklist.full && await bl.findOne({ userID: message.author.id }))
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
			console.log(`User ${message.author.tag} was both white- and blacklisted for auto-action ${action.name}`);
			return true;
		}
		console.log(`User ${message.author.tag} is not permitted for action ${action.name}`);
		return false;
	}
	console.log(`User ${message.author.username} is permitted for action ${action.name}`);
	return true;
}
const exec = {
	'delete': async (message) => message.delete(),
	'message': async (message, args) => message.channel.send(args[0]),
	'embed': async (message, args) => {
		const embed = new MessageEmbed()
			.setTitle(args[0])
			.setDescription(args[1])
			.setFooter(args[2])
			.setColor(args[3] || 'RANDOM');
		if(args[4]) embed.setTimestamp();
		message.channel.send(embed);
	},
	'warn': async (message, args, client) => {
		const punish = await log({
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
				.setAuthor(client.user.username, client.displayAvatarURL())
				.setTitle(`You've been warned in ${message.guild.name}`)
				.addField('Reason', args[0])
				.setFooter(`Punishment ID: ${punish}`);
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
		const punish = await log({
			guildID: message.guild.id,
			userID: message.author.id,
			staffID: client.user.id,
			reason: args[0],
			caseType: 'Mute',
			timestamp: new Date().getTime(),
			expires: Date.now() + args[1],
			isActive: true,
		}, client);
		const embed = new MessageEmbed()
			.setDescription(
				`You got auto-muted in **${message.guild.name}** for \`${
					args[0]
				}\`. You will be unmuted in ${Math.floor(args[1] / 60000)} minutes.`,
			)
			.setFooter(`Punishment ID: ${punish}`)
			.setColor('RANDOM');
		try {
			message.author.send(embed);
		}
		catch (e) {
			// sorry no sorry, you are muted but don't know why
		}
	},
	'ban': async (message, args, client) => {
		if(!message.member.bannable) return;
		const punish = await log({
			guildID: message.guild.id,
			userID: message.author.id,
			staffID: client.user.id,
			reason: args[0],
			caseType: 'Ban',
			timestamp: new Date().getTime(),
		}, client);
		const embed = new MessageEmbed()
			.setDescription(
				`You got auto-banned in **${message.guild.name}** for \`${args[0]}\`. If you think this was a mistake, you can appeal [here](https://forms.gle/SUynmsZQzWwjxwVn7)`,
			)
			.setColor('RED');
		try {
			await message.author.send(embed).then(() => {
				message.guild.members.ban(message.author.id);
			});
		}
		catch (e) {
			// you don't get to know why you got banned because you have dms off... sucks to suck
		}
	},
};
function autoresponder(message, client) {
	const data = require('../json/autores.json');
	data.settings.forEach(async (entry) => {
		if(entry.triggers.some((v) => checkExec(v, message, client))) {
			entry.actions
				.filter(async (a) => await checkAccess(message, a) === true)
				.forEach(async (a) => await exec[a.name](message, a.args, client));
		}
	});
}
module.exports = autoresponder;