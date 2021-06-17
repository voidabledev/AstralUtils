/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const log = require('../../functions/process-log');
const ms = require('../../functions/ms');
const failureEmbed = require('../../functions/failure-embed');
const successEmbed = require('../../functions/success-embed');
const errEmbed = require('../../functions/error-embed');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'mute',
		description: 'Mutes a member.',
		usage: '[mention or id] (time) [reason]',
		aliases: alias.staff.mute,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: ['MANAGE_MESSAGES'],
		botPerms: ['MANAGE_ROLES'],
		requiredRoles: [],
		delete: true,
	},
	// eslint-disable-next-line no-unused-vars
	async execute(message, args, client) {
		let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
		const member =
    message.mentions.members.first() ||
    (await message.guild.members.fetch(args[0]));
		if (!member) return message.channel.send(failureEmbed('You didn\'t provide a valid user mention or ID!'));
		args.shift();
		const time = ms(args[0]);
		if (time > 0) args.shift();
		const reason = args.join(' ');
		if (member.roles.cache.find(r => r.name.toLowerCase() === 'muted')) {
			return message.channel.send(failureEmbed('That user is already muted! Unmute them first to mute them again.'));
		}
		if (member.id === message.author.id) {
			return message.channel.send(failureEmbed('You can\'t mute yourself.'));
		}
		if (member.id === client.user.id) {
			return message.channel.send(failureEmbed('You can\'t mute me! I\'m the muter, remember?'));
		}
		if (message.member.roles.highest.position <= member.roles.highest.position || !member.manageable) {
			return message.channel.send(failureEmbed('You can\'t mute this person!'));
		}
		if (!role) {
			const noRole = new MessageEmbed()
				.setTitle('Muting Error')
				.setDescription('This server currently doesn\'t have a "Muted" role. Would you like to generate one?')
				.setFooter('Say yes or no')
				.setColor('ORANGE');
			message.channel.send(noRole).then(async (msg) => {
				await message.channel.awaitMessages((m) => m.author.id === message.author.id, {
					max: 1,
					time: 60000,
					errors: ['time'],
				}).then(async (m) => {
					if (m.first().content.toLowerCase().includes('yes')) {
						if (message.guild.roles.cache.size >= 250) {
							return message.channel.send(failureEmbed('There are too many roles in your server for me to make another one! [250]'));
						}
						const mutedRole = await message.guild.roles.create({
							data: {
								name: 'Muted',
								color: 'GRAY',
							},
						});
						message.guild.channels.cache.forEach(async (channel) => {
							await channel.createOverwrite(mutedRole, {
								READ_MESSAGES: false,
								SEND_MESSAGES: false,
								READ_MESSAGE_HISTORY: false,
								ADD_REACTIONS: false,
								VIEW_CHANNEL: false,
								CONNECT: false,
								SPEAK: false,
							});
						});
						role = mutedRole;
					}
					else {
						return message.channel.send(failureEmbed('Muting process was cancelled.'));
					}
				}).catch(() => {
					return message.channel.send(failureEmbed('Timed out, muting process was cancelled.'));
				});
			});
		}
		member.roles.add(role);
		const punish = await log({
			guildID: message.guild.id,
			userID: member.user.id,
			staffID: message.author.id,
			reason,
			caseType: 'Mute',
			timestamp: new Date().getTime(),
			expires: time > 0 ? Date.now() + time : null,
			isActive: true,
		}, client);
		const embed = new MessageEmbed()
			.setAuthor(client.user.username, client.user.avatarURL())
			.setTitle(`You've been muted in ${message.guild.name}`)
			.addField('Reason', reason)
			.addField('Expires', time > 0 ? new Date(Date.now() + time).toLocaleString() : 'Permanent')
			.setFooter(`Punishment ID: ${punish}`);
		let messaged = true;
		member.user.send(embed)
			.catch((err) => {
				messaged = false;
				console.error(err);
			});
		return message.channel.send(successEmbed(`${member} has been **muted** |  \`${punish}\`. ${messaged ? '' : ' I was unable to message them.'}`));
	},
};