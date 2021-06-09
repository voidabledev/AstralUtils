/* eslint-disable no-unused-vars */
const alias = require('../../json/aliases.json');
const successEmbed = require('../../functions/success-embed');
const failureEmbed = require('../../functions/failure-embed');
const log = require('../../functions/process-log');
const { MessageEmbed } = require('discord.js');

module.exports = {
	help: {
		name: 'warn',
		description: 'Warns a member',
		usage: '[mention or id] [reason]',
		aliases: alias.staff.warn,
		category: 'staff',
		cooldown: 5,
	},
	data: {
		minArgs: 2,
		maxArgs: null,
		userPerms: ['MANAGE_MESSAGES'],
		botPerms: [],
		requiredRoles: [],
		delete: true,
	},
	async execute(message, args, client) {
		const target = message.mentions.users.first() || await client.users.fetch(args[0]);
		if (!target) return message.channel.send(failureEmbed('Please provide a valid user mention or ID!', 'what a noob'));
		const reason = args.slice(1).join(' ');
		if (target.id === message.author.id) message.channel.send(failureEmbed('You can\'t warn yourself, dummy.'));
		if (target.id === client.user.id) message.channel.send(failureEmbed('You can\'t warn me!'));
		const punish = await log({
			guildID: message.guild.id,
			userID: target.id,
			staffID: message.author.id,
			reason,
			caseType: 'Warn',
			timestamp: new Date().getTime(),
			expires: Date.now() + 1000 * 60 * 60 * 24 * 30,
			isActive: true,
		}, client);
		let successMessage = `${target} has been **warned** | \`${punish}\`. `;
		try {
			const embed = new MessageEmbed()
				.setAuthor(client.user.username, client.displayAvatarURL())
				.setTitle(`You've been warned in ${message.guild.name}`)
				.addField('Reason', reason)
				.setFooter(`Punishment ID: ${punish}`);
			target.send(embed);
		}
		catch {
			successMessage += 'I was unable to DM them.';
		}
		message.channel.send(successEmbed(successMessage, `Punishment ID: ${punish}`));
	},
};