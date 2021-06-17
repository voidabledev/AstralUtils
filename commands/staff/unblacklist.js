/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const bl = require('../../models/blacklistschema');
const log = require('../../functions/process-log');
const conf = require('../../json/configuration.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'unblacklist',
		description: 'Unblacklists a user.',
		usage: '[mention or id] [reason]',
		aliases: alias.staff.unblacklist,
		category: 'staff',
		cooldown: 15,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['831996400782016563', '831996399209414697', '836583124283686943', '831996396684050443', '831996396151636029'],
		delete: true,
	},
	async execute(message, args, client) {
		const target =
    message.mentions.users.first() || await client.users.fetch(args[0]);
		if (!target) {
			return message.channel.send(
				failureEmbed('Please specify someone to unblacklist!'),
			);
		}
		args.shift();
		const reason = args.join(' ');
		const { id } = target;
		if (!await bl.findOne({ userID: target.id })) {
			return message.channel.send(
				failureEmbed('This user isn\'t blacklisted!'),
			);
		}
		if (conf.devs.includes(id) || message.author.id === id) {
			return message.channel.send(
				failureEmbed(
					'If this happens, something is seriously broken or someone modified the database. Please message the devs.',
				),
			);
		}
		const punish = await log({
			guildID: message.guild.id,
			userID: target.id,
			staffID: message.author.id,
			reason,
			caseType: 'Unblacklist',
			timestamp: new Date().getTime(),
		}, client);
		await bl.deleteOne({
			userID: target.id,
		});
		let successMessage = `<@${id}> has been **unblacklisted** | \`${punish}\`. `;
		const embed = new MessageEmbed()
			.setAuthor(client.user.username, client.user.avatarURL())
			.setTitle(`You've been unblacklisted in ${message.guild.name}`)
			.addField('Reason', reason)
			.setFooter(`Punishment ID: ${punish}`);
		try {
			await target.send(embed);
		}
		catch (e) {
			successMessage += 'I was unable to DM them.';
		}
		message.channel.send(
			successEmbed(successMessage),
		);
	},
};