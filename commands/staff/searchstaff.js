/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const punish = require('../../models/punishschema');
const { MessageEmbed } = require('discord.js');
const day = 1000 * 60 * 60 * 24;

module.exports = {
	help: {
		name: 'searchstaff',
		description: 'Searches modlogs done by staff',
		usage: '[mention or id]',
		aliases: alias.staff.searchstaff,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 0,
		maxArgs: null,
		userPerms: ['MANAGE_MESSAGES'],
		botPerms: [],
		requiredRoles: [],
		delete: false,
	},
	async execute(message, args, client) {
		let target = message.mentions.users.first();
		if(!target) {
			try {
				target = await client.users.fetch(args[0]);
			}
			catch {
				target = message.author;
			}
		}
		await punish.find({ staffID: target.id }, (err, logs) => {
			if(err) console.error(err);
			if(!logs.length) {
				const embed = new MessageEmbed()
					.setTitle('Staff Search')
					.setDescription('No punishments found by this user')
					.setFooter('demot')
					.setColor('RED');
				return message.channel.send(embed);
			}
			const embed1 = new MessageEmbed()
				.setTitle('Staff Search')
				.setDescription('This is an overview. Detailed search for staff members is no longer supported, use the `>case` command to view case specific information instead.')
				.setFooter(`User ID: ${target.id}`)
				.setColor('RANDOM');
			const embed2 = new MessageEmbed()
				.setTitle('Staff Search (Continued)')
				.setFooter(`User ID: ${target.id}`)
				.setColor(embed1.color);
			const sorted = {
				Warnings: logs.filter((r) => r.caseType === 'Warn'),
				Mutes: logs.filter((r) => r.caseType === 'Mute'),
				Unmutes: logs.filter((r) => r.caseType === 'Unmute'),
				Kicks: logs.filter((r) => r.caseType === 'Kick'),
				Bans: logs.filter((r) => r.caseType === 'Ban'),
				Unbans: logs.filter((r) => r.caseType === 'Unban'),
				Subtotal: logs.filter((r) =>
					['Warn', 'Mute', 'Unmute', 'Kick', 'Ban', 'Unban'].includes(
						r.caseType,
					),
				),
			};
			const continued = {
				Blacklists: logs.filter((r) => r.caseType === 'Blacklist'),
				Unblacklists: logs.filter((r) => r.caseType === 'Unblacklist'),
				'Nick Moderations': logs.filter(
					(r) => r.caseType === 'Nick Moderation',
				),
				'Changed Nicknames': logs.filter(
					(r) => r.caseType === 'Changed Nickname',
				),
				Total: logs,
			};
			for (const categ in sorted) {
				embed1
					.addField(
						`${categ} \n(last 7 days)`,
						sorted[categ].filter(
							(r) => Date.now() - r.timestamp < 7 * day,
						).length,
						true,
					)
					.addField(
						`${categ} \n(last 30 days)`,
						sorted[categ].filter(
							(r) => Date.now() - r.timestamp < 30 * day,
						).length,
						true,
					)
					.addField(`${categ} \n(all time)`, sorted[categ].length, true);
			}
			for (const categ in continued) {
				embed2
					.addField(
						`${categ} \n(last 7 days)`,
						continued[categ].filter(
							(r) => Date.now() - r.timestamp < 7 * day,
						).length,
						true,
					)
					.addField(
						`${categ} \n(last 30 days)`,
						continued[categ].filter(
							(r) => Date.now() - r.timestamp < 30 * day,
						).length,
						true,
					)
					.addField(`${categ} \n(all time)`, continued[categ].length, true);
			}
			message.channel.send(embed1)
				.then(() => message.channel.send(embed2));
		});
	},
};