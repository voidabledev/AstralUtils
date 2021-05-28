/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const bl = require('../../models/blacklistschema');
const log = require('../../functions/process-log');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'unblacklist',
		description: 'Unblacklists a user',
		usage: '[user id] [reason]',
		aliases: alias.staff.unblacklist,
		category: 'staff',
		cooldown: 15,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: [],
		botPerms: [],
		requiredRoles: ['831996400782016563'],
		delete: true,
	},
	async execute(message, args, client) {
		const target =
    message.mentions.users.first() || client.users.cache.get(args[0]);
		if (!target) {
			return message.channel.send(
				failureEmbed('Please specify someone to unblacklist!'),
			);
		}
		args.shift();
		const reason = args.join(' ');
		const { id } = target;
		if (await bl.findOne({ userID: target.id })) {
			return message.channel.send(
				failureEmbed('This user isn\'t blacklisted!'),
			);
		}
		if (client.conf.devs.includes(id) || message.author.id === id) {
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
		let successMessage = `<@${id}> has been unblacklisted for ${reason} with ID ${punish}!`;
		const embed = new MessageEmbed()
			.setAuthor(client.user, client.displayAvatarURL())
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